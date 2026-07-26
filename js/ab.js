// Smooth scroll for Play button

const playBtn = document.querySelector(".play-btn");

if(playBtn){

    playBtn.addEventListener("click",e=>{

        e.preventDefault();

        document.querySelector("#game").scrollIntoView({

            behavior:"smooth"

        });

    });

}

// Hero image animation

const heroImage = document.querySelector(".hero-right img");

if(heroImage){

    heroImage.addEventListener("mousemove",()=>{

        heroImage.style.transform="scale(1.03) rotate(1deg)";

    });

    heroImage.addEventListener("mouseleave",()=>{

        heroImage.style.transform="scale(1) rotate(0deg)";

    });

}

// Fade in sections

const sections=document.querySelectorAll("section");

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";
            entry.target.style.transform="translateY(0)";

        }

    });

},{
    threshold:.2
});

sections.forEach(section=>{

    section.style.opacity="0";
    section.style.transform="translateY(60px)";
    section.style.transition=".8s";

    observer.observe(section);

});