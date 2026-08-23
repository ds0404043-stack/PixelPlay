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

const loadingMessages = [
    "Loading Assets...",
    "Initializing Engine...",
    "Preparing Minecraft...",
    "Almost Ready..."
];

function hideLoader() {
    loader.classList.add("loader-hide");
}

if (sessionStorage.getItem("pixelplay_loader")) {

    // Loader already shown in this tab
    hideLoader();
    revealSections();

} else {

    let index = 0;
    let loaderFinished = false;

    if (loadingText) {
        loadingText.textContent = loadingMessages[0];
    }

    const interval = setInterval(() => {

        index++;

        if (index < loadingMessages.length && loadingText) {
            loadingText.textContent = loadingMessages[index];
        }

    }, 500);

    function finishLoader() {

        if (loaderFinished) return;

        loaderFinished = true;
        clearInterval(interval);

        hideLoader();
        revealSections();

        try {
            sessionStorage.setItem("pixelplay_loader", "true");
        } catch (error) {
            // Ignore storage errors — the page should still continue.
        }

    }

    // Normal path: wait for the page to finish loading.
    window.addEventListener("load", () => {

        setTimeout(() => {
            finishLoader();
        }, 700);

    }, { once: true });

    // Safety fallback: NEVER let the loader stay stuck because
    // an image, font, or external resource takes too long.
    setTimeout(() => {
        finishLoader();
    }, 3500);

}

// ======================================================
// CONTINUE PLAYING
// ======================================================

const recentGame = JSON.parse(localStorage.getItem("recentGame"));
const recentSection = document.getElementById("recentlyPlayed");

if (recentGame && recentSection) {

    recentSection.style.display = "block";

    document.getElementById("recentName").textContent = recentGame.name;
    document.getElementById("recentImage").src = recentGame.image;
    document.getElementById("recentLink").href = recentGame.page;

    const diff = Date.now() - recentGame.time;

    let lastPlayed = "";

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {

        lastPlayed = "Last Played: Just now";

    } else if (minutes < 60) {

        lastPlayed = `Last Played: ${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    } else if (hours < 24) {

        lastPlayed = `Last Played: ${hours} hour${hours > 1 ? "s" : ""} ago`;

    } else if (days === 1) {

        lastPlayed = "Last Played: Yesterday";

    } else {

        lastPlayed = `Last Played: ${days} days ago`;

    }

    document.getElementById("recentTime").textContent = lastPlayed;

}


// ======================================================
// STICKY HEADER
// ======================================================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 30) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

// ======================================================
// HOME SCROLL
// ======================================================

const homeLink = document.getElementById("homeLink");

if (homeLink) {

    homeLink.addEventListener("click", (e) => {

        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

/* ======================================================
   PIXADU HOMEPAGE V2 — SMALL INTERACTION POLISH
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Make the first viewport feel alive immediately.
    document.querySelectorAll(".hero, .quick-play").forEach(section => {
        section.classList.add("active");
    });

    // Hero touch handling is managed by the main hero slider block above.

    // Subtle tilt on desktop hero artwork.
    if (window.matchMedia("(pointer:fine)").matches) {
        const heroVisual = document.querySelector(".hero-image img");

        if (heroVisual) {
            heroVisual.addEventListener("mousemove", (e) => {
                const rect = heroVisual.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                heroVisual.style.transform =
                    `perspective(900px) rotateY(${x * 4}deg) rotateX(${y * -3}deg) scale(1.015)`;
            });

            heroVisual.addEventListener("mouseleave", () => {
                heroVisual.style.transform = "";
            });
        }
    }
});
