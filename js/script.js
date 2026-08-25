// ======================================================
// 3D HERO COVERFLOW
// ======================================================
const featuredGames = [
    { title: "Minecraft", heading: "Build. Explore. Survive.", description: "Build, explore and survive in an endless block world.", image: "images/minecraft.png", page: "minecraft.html" },
    { title: "GTA Vice City", heading: "Return To Vice City", description: "“Return to Vice City and rule the streets.", image: "images/gta vice city.png", page: "gta.html" },
    { title: "Angry Birds", heading: "Destroy Pig Fortresses", description: "Launch birds and solve fun physics puzzles.", image: "images/angrybirdshero.png", page: "angrybirds.html" },
    { title: "Chess", heading: "Challenge Your Mind", description: "Play the world's most iconic strategy game.", image: "images/chess.jpg", page: "chess.html" },
    { title: "2048", heading: "Can You Reach 2048?", description: "Slide the tiles and beat your highest score.", image: "images/2048.jpg", page: "2048.html" },
    { title: "Subway Surfers", heading: "Escape the Inspector", description: "Run, dodge trains and escape the inspector.", image: "images/subway-surfers.jpg", page: "subway.html" },
    { title: "Tekken 3", heading: "Enter The Fight", description: "Classic arcade fighting action, right in your browser.", image: "images/tekken3.jpg", page: "tekken3.html" }];
const hero = document.querySelector(".hero-3d"), track = document.getElementById("coverflowTrack"), stage = document.getElementById("coverflowStage"), title = document.getElementById("heroTitle"), desc = document.getElementById("heroDescription"), play = document.getElementById("heroPlayBtn"), prev = document.getElementById("prevHero"), next = document.getElementById("nextHero"), dots = document.getElementById("heroDots");
let currentGame = 0, autoTimer, dragStart = 0, dragging = false, lastWheel = 0;
// Preload AND decode hero images before the first coverflow render.
// This prevents low-end/mobile browsers from showing the first slide soft/blurry
// while the image is still being decoded and promoted to a 3D layer.
const heroImageReady = featuredGames.map(g => new Promise(resolve => {
    const i = new Image();
    i.decoding = "sync";
    i.loading = "eager";
    i.src = g.image;
    const done = () => {
        if (i.decode) i.decode().catch(() => {}).finally(resolve);
        else resolve();
    };
    if (i.complete) done();
    else i.addEventListener("load", done, { once: true });
    i.addEventListener("error", resolve, { once: true });
}));
featuredGames.forEach((g, i) => {
    const c = document.createElement("article"); c.className = "cover-card"; c.innerHTML = `<img src="${g.image}" alt="${g.title}" loading="eager" decoding="sync"><div class="cover-shine"></div><div class="cover-label">${g.title}</div>`; c.addEventListener("click", () => { if (i === currentGame) location.href = g.page; else { currentGame = i; render(); resetAuto(); } }); track.appendChild(c);
    const d = document.createElement("button"); d.className = "hero-dot"; d.addEventListener("click", () => { currentGame = i; render(); resetAuto(); }); dots.appendChild(d);
});
const cards = [...track.children], mod = (n, m) => ((n % m) + m) % m;
function render() {
    const n = cards.length;
    cards.forEach((c, i) => { let d = i - currentGame; if (d > n / 2) d -= n; if (d < -n / 2) d += n; let ad = Math.abs(d); c.className = "cover-card " + (!d ? "is-center" : ""); c.style.setProperty("--x", d * 142 + "px"); c.style.setProperty("--z", -ad * 150 + "px"); c.style.setProperty("--r", d * 34 + "deg"); c.style.setProperty("--s", !d ? 1 : Math.max(.64, 1 - ad * .12)); c.style.opacity = ad <= 3 ? (!d ? 1 : Math.max(.28, 1 - ad * .23)) : 0; c.style.pointerEvents = ad <= 3 ? "auto" : "none"; c.style.zIndex = 20 - ad; });
    const g = featuredGames[currentGame]; title.textContent = g.heading; desc.textContent = g.description; play.href = g.page; dots.querySelectorAll(".hero-dot").forEach((d, i) => d.classList.toggle("active", i === currentGame));
}
function nextSlide() { currentGame = mod(currentGame + 1, cards.length); render() } function previousSlide() { currentGame = mod(currentGame - 1, cards.length); render() }
function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(nextSlide, 6500) }
prev?.addEventListener("click", () => { previousSlide(); resetAuto() }); next?.addEventListener("click", () => { nextSlide(); resetAuto() });
let wheelGestureActive = false;
let wheelEndTimer = null;
let wheelLastDirection = 0;

stage?.addEventListener("wheel", e => {

    e.preventDefault();
    e.stopPropagation();

    const direction = e.deltaY > 0 ? 1 : -1;

    clearTimeout(wheelEndTimer);

    /*
       Mouse wheel:
       every individual wheel notch changes one card.

       Trackpad:
       many tiny events arrive together. They are treated
       as one gesture, but the lock is released as soon as
       the event burst actually ends.
    */

    if (!wheelGestureActive) {

        wheelGestureActive = true;
        wheelLastDirection = direction;

        if (direction > 0) {
            nextSlide();
        } else {
            previousSlide();
        }

        resetAuto();
    }

    /*
       Detect the END of the physical trackpad swipe.
       Very short = ready for the next swipe.
    */
    wheelEndTimer = setTimeout(() => {

        wheelGestureActive = false;
        wheelLastDirection = 0;

    }, 80);

}, { passive: false });

stage?.addEventListener("pointerdown", e => { dragging = true; dragStart = e.clientX; stage.setPointerCapture?.(e.pointerId); clearInterval(autoTimer) });
stage?.addEventListener("pointerup", e => { if (!dragging) return; let dx = e.clientX - dragStart; dragging = false; if (Math.abs(dx) > 45) dx < 0 ? nextSlide() : previousSlide(); resetAuto() });
stage?.addEventListener("pointercancel", () => { dragging = false; resetAuto() });
hero?.addEventListener("mouseenter", () => clearInterval(autoTimer)); hero?.addEventListener("mouseleave", resetAuto);
// Wait for the hero images to be decoded before the first render.
// The page loader is already covering this area, so this does not create a blank flash.
Promise.all(heroImageReady).finally(() => {
    render();
    resetAuto();
});

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
    } catch (e) { }
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
    } catch (e) { }
}, 0);

let alreadyLoaded = false;

try {
    alreadyLoaded = sessionStorage.getItem("pixelplay_loader") === "true";
} catch (e) { }

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
        } catch (e) { }

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
