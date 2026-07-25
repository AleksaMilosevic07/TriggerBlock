const fearForm = document.getElementById("fear-form");
let changeWarning = document.getElementById("changeWarning");

changeWarning.style.display = "none";  // Hide on start

fearForm.addEventListener("submit", function(e){
    e.preventDefault();
    const formData = new FormData(fearForm);
    let phobias = formData.getAll("phobias");
    //! Save preferences
});

fearForm.addEventListener("change", function(e){
    //! If selected is different then what is saved, show the warning
    changeWarning.style.display = "block"
});