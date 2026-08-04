// ======================================================
// HERO SLIDER
// ======================================================

const featuredGames = [

    {
        title: "Minecraft",
        heading: "Play Minecraft <br> Directly In Your Browser",
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
    }

];

// Hero Elements
const hero = document.querySelector(".hero");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroImage = document.getElementById("heroImage");
const heroPlayBtn = document.getElementById("heroPlayBtn");
const prevHero = document.getElementById("prevHero");
const nextHero = document.getElementById("nextHero");
const heroDots = document.querySelectorAll(".hero-dot");

let currentGame = 0;

// Update Hero
function updateHero() {

    const game = featuredGames[currentGame];

    heroImage.classList.add("fade-out");
    document.querySelector(".hero-content").classList.add("fade-out");

    setTimeout(() => {

        heroTitle.innerHTML = game.heading;

        heroDescription.textContent = game.description;

        heroImage.src = game.image;
        heroImage.alt = game.title;

        heroPlayBtn.href = game.page;

        if (game.page === "building.html") {

            heroPlayBtn.innerHTML = "🚧 Coming Soon";

        }

        else {

            heroPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> 🎮 Start Playing';

        }

        heroDots.forEach(dot => dot.classList.remove("active"));
        heroDots[currentGame].classList.add("active");

        heroImage.classList.remove("fade-out");
        document.querySelector(".hero-content").classList.remove("fade-out");

    }, 200);

}

updateHero();

// Next Slide
function nextSlide() {

    currentGame++;

    if (currentGame >= featuredGames.length) {
        currentGame = 0;
    }

    updateHero();

}

// Previous Slide
function previousSlide() {

    currentGame--;

    if (currentGame < 0) {
        currentGame = featuredGames.length - 1;
    }

    updateHero();

}

// Auto Slide
let heroInterval = setInterval(nextSlide, 7000);

// Pause on Hover
hero.addEventListener("mouseenter", () => {

    clearInterval(heroInterval);

});

hero.addEventListener("mouseleave", () => {

    nextSlide();

    clearInterval(heroInterval);

    heroInterval = setInterval(nextSlide, 7000);

});

// Buttons
nextHero.addEventListener("click", nextSlide);
prevHero.addEventListener("click", previousSlide);

// Dots
heroDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        currentGame = index;

        updateHero();

    });

});

// Swipe Support
let touchStartX = 0;
let touchEndX = 0;

hero.addEventListener("touchstart", e => {

    touchStartX = e.changedTouches[0].screenX;

});

hero.addEventListener("touchend", e => {

    touchEndX = e.changedTouches[0].screenX;

    if (touchStartX - touchEndX > 50) {

        nextSlide();

    }

    if (touchEndX - touchStartX > 50) {

        previousSlide();

    }

});

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

    loadingText.textContent = loadingMessages[0];

    const interval = setInterval(() => {

        index++;

        if (index < loadingMessages.length) {
            loadingText.textContent = loadingMessages[index];
        }

    }, 600);

    window.addEventListener("load", () => {

        revealSections();

        setTimeout(() => {

            clearInterval(interval);

            hideLoader();

            sessionStorage.setItem("pixelplay_loader", "true");

        }, 2500);

    });

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