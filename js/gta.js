console.log("GTA Loaded");

const playBtn = document.querySelector(".play-game");
const launcher = document.querySelector(".launcher-screen");

const overlay = document.querySelector("#gameOverlay");
const frame = document.querySelector("#gameFrame");

const fullscreen = document.querySelector("#fullscreenBtn");
const exit = document.querySelector("#closeGame");

playBtn.onclick = () => {

    launcher.classList.add("active");

    setTimeout(() => {

        launcher.style.display = "none";

        overlay.classList.add("active");

        frame.src = "games/gtavc/GTA_Vice_City.html";

    }, 2500);

};

fullscreen.onclick = async () => {

    gameMenu.classList.remove("open");

    if (!document.fullscreenElement) {

        await overlay.requestFullscreen();

        // Add a fake history entry
        history.pushState({ game: true }, "");

    } else {

        document.exitFullscreen();

    }

};



exit.onclick = () => {

    gameMenu.classList.remove("open");

    frame.src = "";

    overlay.classList.remove("active");

    launcher.style.display = "none";

    location.reload();

};



const clickOverlay = document.querySelector("#clickToPlay");

clickOverlay.addEventListener("click", () => {

    clickOverlay.classList.add("hide");

    frame.focus();

});


// Handle Android back button
window.addEventListener("popstate", async () => {

    if (document.fullscreenElement) {

        // Exit fullscreen on first back press
        await document.exitFullscreen();

        // Stay on the page
        history.pushState({ game: true }, "");

        return;
    }

});

const escBtn = document.getElementById("escBtn");

escBtn.addEventListener("click", () => {

    gameMenu.classList.remove("open");


    frame.contentWindow.postMessage({
        action: "releaseCursor"
    }, "*");

});


const menuBtn = document.getElementById("gameMenuBtn");
const gameMenu = document.querySelector(".game-menu");

menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    gameMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {

    if (!gameMenu.contains(e.target)) {
        gameMenu.classList.remove("open");
    }

});