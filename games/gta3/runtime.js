(() => {

function startRuntime() {

    console.log("PixelPlay Runtime Started");

    window.GTA = {
        version: "PixelPlay GTA3 Stable v1",
        state: {}
    };

}

window.addEventListener("load", () => {

    setTimeout(startRuntime, 5000);

});

})();