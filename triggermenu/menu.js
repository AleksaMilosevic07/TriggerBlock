import fears from '../fears.json' with { type: 'json' };

const fearForm = document.getElementById("fear-form");
const fearOptions = document.getElementById("fear-options");
let submitButton = document.getElementById("submit");

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
    fearOptions.appendChild(fearCheck);
    
    let br = document.createElement("br");
    fearOptions.appendChild(br);
    
    // Description
    let fearDesc = document.createElement("p");
    fearDesc.innerHTML = `${fears[i].desc}`;
    fearDesc.hidden = true;
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

fearForm.addEventListener("change", function(e){
    //! If selected is different then what is saved, show the warning
    changeWarning.style.display = "block";
});

fearForm.addEventListener("submit", function(e){
    e.preventDefault();
    new FormData(fearForm);
});

fearForm.addEventListener("formdata", function(e){
    let fearList = e.formData;
    fearList = fearList.getAll("fears");
    console.log(fearList);
});