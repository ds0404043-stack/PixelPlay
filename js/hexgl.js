// Smooth Scroll

document.querySelector(".play-btn").addEventListener("click", function(e){

    e.preventDefault();

    document.querySelector("#game").scrollIntoView({

        behavior:"smooth"

    });

});


// Fade Animation

const sections=document.querySelectorAll("section");

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";
            entry.target.style.transform="translateY(0)";

        }

    });

},{threshold:.2});

sections.forEach(section=>{

    section.style.opacity="0";
    section.style.transform="translateY(60px)";
    section.style.transition=".7s";

    observer.observe(section);

});

const gameFrame = document.querySelector(".game-container iframe");

gameFrame.addEventListener("load", () => {
    gameFrame.focus();
});


const iframe = document.querySelector(".game-container iframe");

document
.getElementById("fullscreenBtn")
.addEventListener("click",()=>{

    if(iframe.requestFullscreen){
        iframe.requestFullscreen();
    }
});

document
.getElementById("reloadBtn")
.addEventListener("click",()=>{

    iframe.src = iframe.src;

});