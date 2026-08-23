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
            
            let matches;
            try
            {
                matches = node.querySelectorAll("img");
            }
            catch {return};
            if(matches.length == 0) return
            
            for(let i = 0; i < matches.length; i++)
            {
                // Checking alt text
                if(scanText(matches[i].alt))
                {
                    // blur image
                }
                /* 
                    1. Get parent element
                    2. Check for text around it
                    3. scanText() that 
                    4. If no text, keep going upwards until you find text 
                */
                else
                {
                    let parent = matches[i].parentElement;
                    console.log(parent);                
                }
            }

        });
    });
});

// This function will scan the given text for any trigger words, if they are not in the safe word list, it will return true
function scanText(text)
{
    // Check if any trigger word is in the text
    for(let i = 0; i < triggerWords.length; i++)
    {
        let index = text.search(new RegExp(`\\b${triggerWords[i]}\\b`, "i"))
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
function blurr()
{
    
}