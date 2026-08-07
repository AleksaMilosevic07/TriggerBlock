let activeFears = [];

const selectedFears = browser.storage.local.get("fears");
selectedFears.then((result) => {
    activeFears = result.fears;
    console.log(`Fears: ${activeFears}`);
});