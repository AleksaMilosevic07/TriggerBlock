import fears from '../fears.json' with { type: 'json' };

const fearForm = document.getElementById("fear-options");

for(let i = 0; i < fears.length; i++)
{
    // Label
    let fear = document.createElement("label");
    fear.innerText = `${fears[i].name}`;
    fearForm.appendChild(fear);
    
    // Checkbox
    let fearCheck = document.createElement("input")
    fearCheck.type = "checkbox";
    fearCheck.id = fears[i].name;
    fearCheck.value = fears[i].name;
    fearForm.appendChild(fearCheck);
    
    let br = document.createElement("br");
    fearForm.appendChild(br);
    
    // Description
    let fearDesc = document.createElement("p");
    fearDesc.innerHTML = `${fears[i].desc}`;
    fearDesc.hidden = true;
    fearForm.appendChild(fearDesc);
    
    // Event listener
    fearCheck.addEventListener("click", function(e){
        if(fearCheck.checked)
        {
            fearDesc.hidden = false;
        }
        else fearDesc.hidden = true;
    });
}


