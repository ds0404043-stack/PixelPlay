console.log("GTA Loaded");

const gtaPlayBtn = document.querySelector(".play-game");
const gtaLauncher = document.querySelector("#gtaLauncher");
const gameOverlay = document.querySelector("#gameOverlay");
const gameFrame = document.querySelector("#gameFrame");

const gtaFullscreenBtn = document.querySelector("#fullscreenBtn");
const gtaExitBtn = document.querySelector("#closeGame");
const gtaEscBtn = document.querySelector("#escBtn");

const gameMenuBtn = document.querySelector("#gameMenuBtn");
const gtaMenu = document.querySelector(".game-menu");

const continueGameBtn = document.querySelector("#continueGameBtn");

const cheatsBtn = document.querySelector("#cheatsBtn");
const cheatsPopup = document.querySelector("#cheatsPopup");
const closeCheats = document.querySelector("#closeCheats");

let gtaStarted = false;
let gtaContinued = false;


/* =========================================
   LAUNCHER
========================================= */

function showLauncher() {
    if (!gtaLauncher) return;

    gtaLauncher.classList.add("active");
    gtaLauncher.style.display = "flex";
}

function hideLauncher() {
    if (!gtaLauncher) return;

    gtaLauncher.classList.remove("active");
    gtaLauncher.style.display = "none";
}


/* =========================================
   START VICE CITY
========================================= */

function startViceCity() {

    if (!gameOverlay || !gameFrame) return;

    gtaStarted = true;

    // Open the game layer FIRST
    gameOverlay.classList.add("active");

    // Load Vice City only once
    if (
        !gameFrame.src ||
        !gameFrame.src.includes("GTA_Vice_City.html")
    ) {
        gameFrame.src = "games/gtavc/GTA_Vice_City.html";
    }
}


/* =========================================
   PLAY VICE CITY
   ONLY SHOW INSTRUCTIONS
========================================= */

if (gtaPlayBtn) {

    gtaPlayBtn.onclick = (e) => {

        e.preventDefault();

        gtaStarted = false;
        gtaContinued = false;

        showLauncher();
    };
}


/* =========================================
   CONTINUE PLAYING
   THIS BUTTON STARTS THE GAME
========================================= */

if (continueGameBtn) {

    continueGameBtn.onclick = (e) => {

        e.preventDefault();
        e.stopPropagation();

        gtaContinued = true;

        // Start the game FIRST
        startViceCity();

        // Then hide instructions
        hideLauncher();

        // Focus the game
        try {
            gameFrame.focus();
            gameFrame.contentWindow?.focus();
        } catch (error) {
            console.warn("Could not focus GTA iframe");
        }
    };
}


/* =========================================
   GAME MENU
========================================= */

if (gameMenuBtn && gtaMenu) {

    gameMenuBtn.addEventListener("click", (e) => {

        e.preventDefault();
        e.stopPropagation();

        gtaMenu.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {

        if (!gtaMenu.contains(e.target)) {
            gtaMenu.classList.remove("open");
        }
    });
}


/* =========================================
   FULLSCREEN
========================================= */

if (gtaFullscreenBtn) {

    gtaFullscreenBtn.onclick = async () => {

        gtaMenu?.classList.remove("open");

        try {

            if (!document.fullscreenElement) {

                await gameOverlay.requestFullscreen();

                history.pushState(
                    { game: true },
                    ""
                );

            } else {

                await document.exitFullscreen();
            }

        } catch (error) {

            console.error(
                "Fullscreen error:",
                error
            );
        }
    };
}


/* =========================================
   RELEASE CURSOR
========================================= */

if (gtaEscBtn) {

    gtaEscBtn.addEventListener("click", () => {

        gtaMenu?.classList.remove("open");

        try {

            gameFrame?.contentWindow?.postMessage(
                {
                    action: "releaseCursor"
                },
                "*"
            );

        } catch (error) {

            console.error(
                "Release Cursor error:",
                error
            );
        }
    });
}


/* =========================================
   CHEATS
========================================= */

if (cheatsBtn && cheatsPopup) {

    cheatsBtn.addEventListener("click", (e) => {

        e.preventDefault();
        e.stopPropagation();

        cheatsPopup.classList.add("active");

        gtaMenu?.classList.remove("open");
    });
}


if (closeCheats && cheatsPopup) {

    closeCheats.addEventListener("click", () => {

        cheatsPopup.classList.remove("active");
    });
}


/* =========================================
   EXIT GAME
========================================= */

if (gtaExitBtn) {

    gtaExitBtn.onclick = () => {

        gtaMenu?.classList.remove("open");

        if (gameFrame) {
            gameFrame.src = "";
        }

        if (gameOverlay) {
            gameOverlay.classList.remove("active");
        }

        gtaStarted = false;
        gtaContinued = false;

        location.reload();
    };
}


/* =========================================
   BROWSER BACK
========================================= */

window.addEventListener("popstate", async () => {

    if (document.fullscreenElement) {

        try {

            await document.exitFullscreen();

            history.pushState(
                { game: true },
                ""
            );

        } catch (error) {

            console.error(
                "Exit fullscreen error:",
                error
            );
        }
    }
});


/* =========================================
   GAME LOAD
========================================= */

if (gameFrame) {

    gameFrame.addEventListener("load", () => {

        // Never reload the page
        // Never restart the iframe here

        if (!gtaContinued) {
            showLauncher();
        }
    });
}