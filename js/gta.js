console.log("gta.js loaded");

const playBtn = document.querySelector(".play-game");
const launcherScreen = document.querySelector(".launcher-screen");

playBtn.addEventListener("click", () => {

    launcherScreen.classList.add("active");

    setTimeout(() => {
        window.location.href = "games/gtavc/GTA_Vice_City.html";
    }, 2500);

});