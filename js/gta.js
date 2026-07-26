console.log("gta.js loaded");

const fullscreenBtn = document.getElementById("fullscreenBtn");
const gameContainer = document.getElementById("gameContainer");
const playBtn = document.querySelector(".play-game");
const launcherScreen = document.querySelector(".launcher-screen");

playBtn.addEventListener("click", () => {

    launcherScreen.classList.add("active");

    setTimeout(() => {

        launcherScreen.classList.remove("active");

        document.getElementById("gtaFrame").style.display = "block";

    },2500);

});

fullscreenBtn.addEventListener("click",()=>{

    const iframe=document.getElementById("gtaFrame");

    if(iframe){

        if(iframe.requestFullscreen){

            iframe.requestFullscreen();

        }else if(iframe.webkitRequestFullscreen){

            iframe.webkitRequestFullscreen();

        }

    }

});