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
            console.log(matches);
        });
    });

});

// This function will scan the given text for any trigger words, if they are not in the safe word list, it will return positive 
function scanText(text)
{
    
}