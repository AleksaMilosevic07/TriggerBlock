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
    // Loop over all new added nodes and scan for images
    mutationList.forEach(mutationRecord => {
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
    img.parentElement.appendChild(overlayCard);

    // Stop the video from playing
    if(img.pause) img.pause();
    img.autoplay = false;
}

// This is how many elements upwards will it search for potential trigger content 
const searchLevel = 3;
// Minimal size of an image element to be worth scanning
const MIN = 32;
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
        if (matches[i].clientWidth < MIN || matches[i].clientHeight < MIN) continue; // Ignore emojis
        scanContext(matches[i], matches[i].parentElement, searchLevel)
    }
}



// Scan the surrounding text on the image, walk up the dom tree looking for potential matches
function scanContext(media, parent, level)
{
    if(level <= 0) return;
    let probe = media.tagName === "VIDEO" ? media.title : media.alt;
    if(scanText(probe))
    {
        blurr(media);
        return;
    }
    else
    {
        let parentElement = parent.parentElement;
        let parentChildren = parentElement.childNodes;
        
        for(const child of parentChildren)
        {
            let childText = child.textContent;
            if(scanText(childText))
            {
                blurr(media);
                return;
            }
        }
        // If there is no meaningful content to scan in the child element, call the function again WITHOUT decrementing the level
        if(parentElement.textContent.trim().length == 0 && parentElement)
        {
            parentElement = parentElement.parentElement;
            scanContext(media, parentElement, level); 
        }
        else 
        {
            // Call the function recursively for the parent
            scanContext(media, parentElement, --level);
        }
    }
}