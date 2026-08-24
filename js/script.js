// ======================================================
// HERO SLIDER
// ======================================================

const featuredGames = [

    {
        title: "Minecraft",
        heading: "Build. Explore. Survive⛏️",
        description: "Build, explore and survive in an endless block world.",
        image: "images/minecraft.png",
        page: "minecraft.html"
    },

    {
        title: "GTA Vice City",
        heading: "Return To Vice City",
        description: "Experience the legendary open-world crime adventure.",
        image: "images/gta vice city.png",
        page: "gta.html"
    },

    {
        title: "Angry Birds",
        heading: "Destroy Pig Fortresses",
        description: "Launch birds and solve fun physics puzzles.",
        image: "images/angrybirdshero.png",
        page: "angrybirds.html"
    },

    {
        title: "Chess",
        heading: "Challenge Your Mind",
        description: "Play the world's most iconic strategy game.",
        image: "images/chess.jpg",
        page: "chess.html"
    },

    {
        title: "2048",
        heading: "Can You Reach 2048?",
        description: "Slide the tiles and beat your highest score.",
        image: "images/2048.jpg",
        page: "2048.html"
    },

    {
        title: "Subway Surfers",
        heading: "Escape the Inspector",
        description: "Run, dodge trains, collect coins and escape the inspector in this endless runner.",
        image: "images/subway-surfers.jpg",
        page: "subway.html"
    }

];

// Hero Elements
const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroImage = document.getElementById("heroImage");
const heroPlayBtn = document.getElementById("heroPlayBtn");
const prevHero = document.getElementById("prevHero");
const nextHero = document.getElementById("nextHero");
const heroDots = document.querySelectorAll(".hero-dot");

let currentGame = 0;
let heroInterval = null;
let heroChanging = false;
let heroChangeTimer = null;

// Preload hero artwork so the transition never waits for the next image.
featuredGames.forEach(game => {
    const preload = new Image();
    preload.src = game.image;
});

// Update only the content for the selected game.
function applyHeroContent(game) {

    heroTitle.innerHTML = game.heading;
    heroDescription.textContent = game.description;

    heroImage.alt = game.title;
    heroPlayBtn.href = game.page;

    if (game.page === "building.html") {
        heroPlayBtn.innerHTML = "🚧 Coming Soon";
    } else {
        heroPlayBtn.innerHTML =
            '<i class="fa-solid fa-play"></i>  Start Playing';
    }

    heroDots.forEach(dot => dot.classList.remove("active"));

    if (heroDots[currentGame]) {
        heroDots[currentGame].classList.add("active");
    }
}

// Smooth hero transition.
function updateHero(direction = 1, instant = false) {

    const game = featuredGames[currentGame];

    clearTimeout(heroChangeTimer);

    if (instant) {

        applyHeroContent(game);

        heroImage.src = game.image;

        heroImage.classList.remove(
            "hero-slide-out",
            "hero-slide-in"
        );

        heroImage.classList.add("hero-slide-active");

        heroContent.classList.remove(
            "hero-content-out",
            "hero-content-in"
        );

        return;
    }

    if (heroChanging) return;

    heroChanging = true;

    // Slide the current content out smoothly.
    heroImage.classList.remove("hero-slide-active");
    heroImage.classList.add("hero-slide-out");

    heroContent.classList.remove("hero-content-in");
    heroContent.classList.add("hero-content-out");

    heroChangeTimer = setTimeout(() => {

        // Change the hidden content.
        applyHeroContent(game);

        heroImage.src = game.image;

        // Prepare the new slide.
        heroImage.classList.remove("hero-slide-out");
        heroImage.classList.add("hero-slide-in");

        heroContent.classList.remove("hero-content-out");
        heroContent.classList.add("hero-content-in");

        // Force the browser to paint the starting state first.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                heroImage.classList.remove("hero-slide-in");
                heroImage.classList.add("hero-slide-active");

                heroContent.classList.remove("hero-content-in");

            });
        });

        heroChangeTimer = setTimeout(() => {
            heroChanging = false;
        }, 330);

    }, 170);
}

// Initial hero state — no startup flash.
updateHero(1, true);

// Next slide.
function nextSlide() {

    if (heroChanging) return;

    currentGame++;

    if (currentGame >= featuredGames.length) {
        currentGame = 0;
    }

    updateHero(1);
}

// Previous slide.
function previousSlide() {

    if (heroChanging) return;

    currentGame--;

    if (currentGame < 0) {
        currentGame = featuredGames.length - 1;
    }

    updateHero(-1);
}

// Auto slide.
function startHeroTimer() {

    clearInterval(heroInterval);

    heroInterval = setInterval(() => {
        nextSlide();
    }, 7000);
}

function stopHeroTimer() {
    clearInterval(heroInterval);
    heroInterval = null;
}

startHeroTimer();

// Pause on hover — do NOT change the slide when the mouse leaves.
if (hero) {

    hero.addEventListener("mouseenter", () => {
        stopHeroTimer();
    });

    hero.addEventListener("mouseleave", () => {
        startHeroTimer();
    });

}

// Arrow buttons.
if (nextHero) {
    nextHero.addEventListener("click", () => {
        nextSlide();
        startHeroTimer();
    });
}

if (prevHero) {
    prevHero.addEventListener("click", () => {
        previousSlide();
        startHeroTimer();
    });
}

// Dots.
heroDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        if (index === currentGame || heroChanging) return;

        const previousIndex = currentGame;
        currentGame = index;

        updateHero(index > previousIndex ? 1 : -1);
        startHeroTimer();

    });

});

// Swipe + mouse wheel support.
let touchStartX = 0;
let touchEndX = 0;
let wheelLocked = false;
let lastWheelDirection = 0;

if (hero) {

    // Touch/swipe is locked to the hero IMAGE only.
    // The rest of the page remains normally scrollable.
    const heroImageArea = document.querySelector(".hero-image");

    if (heroImageArea) {

        heroImageArea.addEventListener("touchstart", e => {

            touchStartX = e.changedTouches[0].screenX;
            stopHeroTimer();

        }, { passive: true });

        heroImageArea.addEventListener("touchmove", e => {

            const currentX = e.changedTouches[0].screenX;
            const distance = Math.abs(currentX - touchStartX);

            // Once the finger is clearly swiping horizontally,
            // lock native page scrolling for this gesture.
            if (distance > 10) {
                e.preventDefault();
            }

        }, { passive: false });

        heroImageArea.addEventListener("touchend", e => {

            touchEndX = e.changedTouches[0].screenX;

            const swipeDistance = touchStartX - touchEndX;

            if (Math.abs(swipeDistance) > 50) {

                // Prevent the page from continuing to move after the swipe.
                if (swipeDistance > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }

            }

            startHeroTimer();

        }, { passive: true });

        heroImageArea.addEventListener("touchcancel", () => {
            startHeroTimer();
        }, { passive: true });

    }

    // Mouse-wheel control is ONLY active while the cursor is directly
    // over the hero artwork/image. The rest of the page scrolls normally.
    // Reuse the heroImageArea declared above.
    if (heroImageArea) {

        heroImageArea.addEventListener("wheel", e => {

            if (Math.abs(e.deltaY) < 8) return;

            // Prevent page scrolling only when the wheel is over the image.
            e.preventDefault();
            e.stopPropagation();

            if (wheelLocked) return;

            const direction = e.deltaY > 0 ? 1 : -1;

            wheelLocked = true;

            stopHeroTimer();

            if (direction > 0) {
                nextSlide();
            } else {
                previousSlide();
            }

            // Allows continuous scrolling while avoiding duplicate
            // events from a single wheel tick.
            setTimeout(() => {
                wheelLocked = false;
            }, 300);

            startHeroTimer();

        }, { passive: false });

    }

}

console.log("SCRIPT LOADED");

// ======================================================
// CURSOR GLOW
// ======================================================

const glow = document.querySelector(".cursor-glow");

if (glow) {

    document.addEventListener("mousemove", (e) => {

        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";

    });

}


// ======================================================
// SCROLL REVEAL
// ======================================================

const reveals = document.querySelectorAll(".reveal");

function revealSections() {

    const windowHeight = window.innerHeight;

    reveals.forEach((section) => {

        const revealTop = section.getBoundingClientRect().top;

        if (revealTop < windowHeight - 120) {

            section.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealSections);


// ======================================================
// LOADER
// ======================================================

const loader = document.getElementById("loader");
const loadingText = document.getElementById("loading-text");
const progress = document.querySelector("#loader .progress");

const loadingMessages = [
    "Loading Assets...",
    "Initializing Engine...",
    "Preparing Minecraft...",
    "Almost Ready..."
];

let loaderDone = false;

function setLoaderProgress(value) {
    if (progress) progress.style.width = value + "%";
}

function hideLoader() {
    if (loaderDone) return;
    loaderDone = true;

    setLoaderProgress(100);

    if (loader) {
        loader.classList.add("loader-hide");
    }

    try {
        sessionStorage.setItem("pixelplay_loader", "true");
    } catch (e) {}
}

function finishLoader() {
    if (loadingText) {
        loadingText.textContent = "Almost Ready...";
    }

    setLoaderProgress(100);

    setTimeout(hideLoader, 250);
}

/* Always reveal the page independently of the loader. */
setTimeout(() => {
    try {
        revealSections();
    } catch (e) {}
}, 0);

let alreadyLoaded = false;

try {
    alreadyLoaded = sessionStorage.getItem("pixelplay_loader") === "true";
} catch (e) {}

if (alreadyLoaded) {

    hideLoader();

} else {

    setLoaderProgress(8);

    const steps = [
        [550, 35, "Initializing Engine..."],
        [1100, 68, "Preparing Minecraft..."],
        [1650, 90, "Almost Ready..."]
    ];

    steps.forEach(([delay, value, message]) => {
        setTimeout(() => {
            if (loaderDone) return;
            if (loadingText) loadingText.textContent = message;
            setLoaderProgress(value);
        }, delay);
    });

    /* Normal fast path. */
    window.addEventListener("load", () => {
        try {
            revealSections();
        } catch (e) {}

        setTimeout(finishLoader, 250);
    }, { once: true });

    /*
       Absolute safety fallback.
       This does NOT call revealSections(), so an error anywhere
       else on the page cannot stop the loader from disappearing.
    */
    setTimeout(() => {
        finishLoader();
    }, 3500);
}
