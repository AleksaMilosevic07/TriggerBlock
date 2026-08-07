let activeFears = [];

const selectedFears = browser.storage.local.get("fears");
selectedFears.then((results) => {
    activeFears = results.fears;
    console.log(`Fears: ${activeFears}`);
});


