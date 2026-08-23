// Fears
let fearsPromise = fetch(browser.runtime.getURL("fears.json"))
.then(res => res.json())

// List of active fears will be loaded here
let activeFearsPromise = browser.storage.local.get({ fears: [] })
.then(res => res.fears);

let triggerWords = []; 
let safeWords = [];

const triggerDetection = Promise.all([fearsPromise, activeFearsPromise])
.then(([fears, activeFears]) => {
    // Joining all trigger and safe words     
    for(let i = 0; i < fears.length; i++)
    {
        if(activeFears.includes(fears[i].name))
        {
            triggerWords = triggerWords.concat(fears[i].triggerWords);
            safeWords = safeWords.concat(fears[i].safeWords);
        }
    }
    
    observer.observe(document.body, {subtree: true, childList: true});
    scanPage(document.body); // Initial scan, before MutationObserver fires up
});

// Function will fire once a detection in the dom is notice
const observer = new MutationObserver(mutationList => {
    /* 
        1. Loop over all individual records
        2. If any of them are images, check the parent element
        3. Inspect the parent element for headings, paragraphs, and other text (scanText function) 
    */ 
    mutationList.forEach(mutationRecord => {
        // console.log(mutationRecord);
        mutationRecord.addedNodes.forEach(node => {
            scanPage(node);
        });
    });
});

// This function will scan the given text for any trigger words, if they are not in the safe word list, it will return true
function scanText(text)
{
    // Check if any trigger word is in the text
    for(let i = 0; i < triggerWords.length; i++)
    {
        let index = text.search(new RegExp(`\\b${triggerWords[i]}(?:es|s)?\\b`, "i"))
        // If you find the word on the list...
        if(index != -1)
        {
            // Check if remainder of the string is a safeword
            for(let s = 0; s < safeWords.length; s++)
            {
                let substring = text.substring(index - safeWords[s].length, index + safeWords[s].length);
                if(substring.search(new RegExp(safeWords[s], "i")) != -1) return false;  
            }            
            return true; // It is not on the safeword list
        }
    }
    return false; // No trigger words found    
}

// Blur the media
function blurr(img)
{
    if(img.classList.contains("tb-blurred")) return;
    img.parentElement.classList.add("tb-shield-host");
    img.classList.add("tb-blurred");
    // Overlay card, warning and reveal button added to here, and card is appended to img element
    let overlayCard = document.createElement("div");
    overlayCard.classList.add("tb-overlay");
    // Warning text
    let p = document.createElement("p");
    p.classList.add("tb-warning");
    p.innerText = "This content might be sensitive";
    overlayCard.appendChild(p);
    // Reveal button
    let b = document.createElement("button");
    b.innerText = "Reveal";
    b.classList.add("tb-reveal");
    
    // Button event listener
    b.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        img.classList.add("tb-revealed");
        img.parentElement.classList.add("tb-revealed");
    });
    
    overlayCard.appendChild(b);
    img.after(overlayCard);
}

const MIN = 40; // Every image below this size will be ignored, specifically made to address twitter emojis
// It will look images, and send them further for their content to be scanned
function scanPage(node)
{
    let matches;
    try
    {
        matches = node.querySelectorAll("img, video");
    }
    catch {return};
    
    if(matches.length == 0) return
    
    for(let i = 0; i < matches.length; i++)
    {
        // if (matches[i].clientWidth < MIN || matches[i].clientHeight < MIN) continue; // Ignore emojis
        let probe = matches[i].tagName === "VIDEO" ? matches[i].title : matches[i].alt;
        
        if(scanText(probe))
        {
            blurr(matches[i]);
        }
        else
        {
            let parent = matches[i].parentElement;
            let parentChildren = parent.childNodes;
            parentChildren.forEach(child => {
                if(scanText(child.textContent))
                {
                    blurr(matches[i]);
                }
            });
        }
    }
}