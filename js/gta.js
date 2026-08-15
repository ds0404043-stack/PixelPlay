console.log("GTA Loaded");

const playBtn = document.querySelector(".play-game");
const launcher = document.querySelector(".launcher-screen");

const overlay = document.querySelector("#gameOverlay");
const frame = document.querySelector("#gameFrame");

const fullscreen = document.querySelector("#fullscreenBtn");
const exit = document.querySelector("#closeGame");

if (!playBtn || !launcher || !overlay || !frame) {
    console.error("GTA: required game elements are missing.");
} else {

    // ================================
    // PLAY GAME
    // ================================

    playBtn.onclick = () => {

        launcher.classList.add("active");

        setTimeout(() => {

            launcher.style.display = "none";

            overlay.classList.add("active");

            // IMPORTANT:
            // The redesigned Pixadu page does NOT use .menu-btn.
            // Do not access it here.

            frame.src = "games/gtavc/GTA_Vice_City.html";

        }, 2500);

    };


    // ================================
    // FULLSCREEN
    // ================================

    if (fullscreen) {

        fullscreen.onclick = async () => {

            if (!document.fullscreenElement) {

                try {

                    await overlay.requestFullscreen();

                    history.pushState({ game: true }, "");

                } catch (err) {

                    console.error("GTA fullscreen error:", err);

                }

            } else {

                try {

                    await document.exitFullscreen();

                } catch (err) {

                    console.error("GTA exit fullscreen error:", err);

                }

            }

        };

    }


    // ================================
    // EXIT GAME
    // ================================

    if (exit) {

        exit.onclick = () => {

            frame.src = "";

            overlay.classList.remove("active");

            launcher.style.display = "none";

            location.reload();

        };

    }


    // ================================
    // CLICK TO PLAY
    // ================================

    const clickOverlay = document.querySelector("#clickToPlay");
    const gotItBtn = document.querySelector("#gotItBtn");

    if (gotItBtn && clickOverlay) {

        gotItBtn.addEventListener("click", (e) => {

            e.stopPropagation();

            clickOverlay.classList.add("hide");

            frame.focus();

        });

    }


    // ================================
    // ANDROID / BROWSER BACK
    // ================================

    window.addEventListener("popstate", async () => {

        if (document.fullscreenElement) {

            try {

                await document.exitFullscreen();

            } catch (err) {

                console.error("GTA fullscreen exit error:", err);

            }

            history.pushState({ game: true }, "");

        }

    });


    // ================================
    // ESC BUTTON
    // ================================

    const escBtn = document.getElementById("escBtn");

    if (escBtn) {

        escBtn.addEventListener("click", () => {

            if (frame.contentWindow) {

                frame.contentWindow.postMessage(
                    {
                        action: "releaseCursor"
                    },
                    "*"
                );

            }

        });

    }


    // ================================
    // GAME TOOLBAR
    // ================================

    const toolbar = document.querySelector(".game-toolbar");

    let hideTimer;


    function showToolbar() {

        if (!toolbar) return;

        toolbar.style.opacity = "1";

        clearTimeout(hideTimer);

        hideTimer = setTimeout(() => {

            if (document.fullscreenElement) {

                toolbar.style.opacity = "0";

            }

        }, 2500);

    }


    if (toolbar) {

        overlay.addEventListener("mousemove", showToolbar);

        overlay.addEventListener("touchstart", showToolbar);

    }


    // ================================
    // GAME MENU
    // ================================

    const gameMenuBtn =
        document.getElementById("gameMenuBtn");

    const gameMenuPopup =
        document.querySelector(".game-menu-popup");


    if (gameMenuBtn && gameMenuPopup) {

        gameMenuBtn.addEventListener("click", (e) => {

            e.stopPropagation();

            gameMenuPopup.classList.toggle("active");

        });


        document.addEventListener("click", (e) => {

            if (!e.target.closest(".game-menu")) {

                gameMenuPopup.classList.remove("active");

            }

        });

    }

}