console.log("GTA Loaded");

// =========================
// ELEMENTS
// =========================

const gtaPlayBtn = document.querySelector(".play-game");
const gtaLauncher = document.querySelector(".launcher-screen");

const gameOverlay = document.querySelector("#gameOverlay");
const gameFrame = document.querySelector("#gameFrame");

const gtaFullscreenBtn = document.querySelector("#fullscreenBtn");
const gtaExitBtn = document.querySelector("#closeGame");
const gtaEscBtn = document.querySelector("#escBtn");

const gameMenuBtn = document.getElementById("gameMenuBtn");
const gtaMenu = document.querySelector(".game-menu");

const clickOverlay = document.querySelector("#clickToPlay");

// =========================
// PLAY GAME
// =========================

gtaPlayBtn.onclick = () => {

    gtaLauncher.classList.add("active");

    setTimeout(() => {

        gtaLauncher.style.display = "none";

        gameOverlay.classList.add("active");

        gameFrame.src = "games/gtavc/GTA_Vice_City.html";

    }, 2500);

};

// =========================
// FULLSCREEN
// =========================

gtaFullscreenBtn.onclick = async () => {

    gtaMenu.classList.remove("open");

    if (!document.fullscreenElement) {

        await gameOverlay.requestFullscreen();

        history.pushState({ game: true }, "");

    } else {

        document.exitFullscreen();

    }

};

// =========================
// EXIT GAME
// =========================

gtaExitBtn.onclick = () => {

    gtaMenu.classList.remove("open");

    gameFrame.src = "";

    gameOverlay.classList.remove("active");

    gtaLauncher.style.display = "none";

    location.reload();

};

// =========================
// CLICK TO PLAY
// =========================

clickOverlay.addEventListener("click", () => {

    clickOverlay.classList.add("hide");

    gameFrame.focus();

});

// =========================
// ANDROID BACK BUTTON
// =========================

window.addEventListener("popstate", async () => {

    if (document.fullscreenElement) {

        await document.exitFullscreen();

        history.pushState({ game: true }, "");

        return;

    }

});

// =========================
// ESC BUTTON
// =========================

gtaEscBtn.addEventListener("click", () => {

    gtaMenu.classList.remove("open");

    gameFrame.contentWindow.postMessage({
        action: "releaseCursor"
    }, "*");

});

// =========================
// HAMBURGER MENU
// =========================

gameMenuBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    gtaMenu.classList.toggle("open");

});

document.addEventListener("click", (e) => {

    if (!gtaMenu.contains(e.target)) {

        gtaMenu.classList.remove("open");

    }

});