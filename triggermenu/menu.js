import fears from '../fears.json' with { type: 'json' };

const fearForm = document.getElementById("fear-form");
const fearOptions = document.getElementById("fear-options");
let submitButton = document.getElementById("submit");
let clearButton = document.getElementById("reset");
const changeWarning = document.getElementById("changeWarning");

let loadedFears = [];
const loadPreferences = browser.storage.local.get({ fears: [] });
loadPreferences.then((results) => {
    loadedFears = results.fears;
    for(let i = 0; i < fears.length; i++)
    {
        // Label
        let fear = document.createElement("label");
        fear.innerText = `${fears[i].name}`;
        fearOptions.appendChild(fear);
        
        // Checkbox
        let fearCheck = document.createElement("input")
        fearCheck.type = "checkbox";
        fearCheck.name = "fears";
        fearCheck.id = fears[i].name;
        fearCheck.value = fears[i].name;
        if(loadedFears.includes(fears[i].name))
        {
            fearCheck.checked = true;
        }
        fearOptions.appendChild(fearCheck);

        let br = document.createElement("br");
        fearOptions.appendChild(br);

        // Description
        let fearDesc = document.createElement("p");
        fearDesc.innerHTML = `${fears[i].desc}`;
        if(fearCheck.checked) fearDesc.hidden = false;
        else fearDesc.hidden = true;
        fearOptions.appendChild(fearDesc);

        // Event listener
        fearCheck.addEventListener("click", function(e){
            if(fearCheck.checked)
            {
                fearDesc.hidden = false;
            }
            else fearDesc.hidden = true;
        });
    }   
});

clearButton.addEventListener("click", function(e){
    changeWarning.style.display = "block";
});

fearForm.addEventListener("change", function(e){
    changeWarning.style.display = "block";
});

fearForm.addEventListener("submit", function(e){
    e.preventDefault();
    new FormData(fearForm);
    changeWarning.style.display = "";
});

fearForm.addEventListener("formdata", function(e){
    let fearList = e.formData;
    fearList = fearList.getAll("fears");
    const savePreference = browser.storage.local.set({"fears": fearList});
    savePreference.then(() => {
        console.log("Succesfully saved preference!");
    }).catch(() => {
        console.log("Failed to save preference!");
    });
});

const logo = document.getElementById("logo");
logo.addEventListener("click", function(e){
    if(logo.className.search("jump") == -1)
    {
        logo.classList.add("jump")
    }
});
logo.addEventListener("animationend", function(e){
    logo.classList.remove("jump");
});

const manifest = browser.runtime.getManifest();
const versionText = document.getElementById("version");

versionText.innerText = `v${manifest.version}`;