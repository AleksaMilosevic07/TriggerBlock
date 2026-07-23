console.log("test");
import fears from '../fears.json' with { type: 'json' };

const fearForm = document.getElementById("fear-options");

for(let i = 0; i < fears.length; i++)
{
    let fear = document.createElement("label");
    fear.innerText = `${fears[i].name}`;
    fearForm.appendChild(fear);
    let fearCheck = document.createElement("input")
    fearCheck.type = "checkbox";
    fearCheck.id = fears[i].name;
    fearCheck.value = fears[i].name;
    fearForm.appendChild(fearCheck);
    
    let br = document.createElement("br");
    fearForm.appendChild(br);
}
