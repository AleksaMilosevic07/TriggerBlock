const fearForm = document.getElementById("fear-form");

fearForm.addEventListener("submit", function(e){
    e.preventDefault();
    const formData = new FormData(fearForm);
    let phobias = formData = formData.getAll("phobias");
    console.log(phobias);
})
