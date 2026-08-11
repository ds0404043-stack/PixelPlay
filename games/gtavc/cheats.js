// ==========================================
// GTA VICE CITY - FULL CHEAT LIBRARY
// ==========================================

function sendCheat(code) {

    const gameFrame = document.getElementById("gameFrame");

    if (!gameFrame || !gameFrame.contentWindow) {
        console.error("Game frame not found.");
        return;
    }

    gameFrame.contentWindow.focus();

    for (const letter of code) {

        gameFrame.contentWindow.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: letter,
                code: "Key" + letter,
                bubbles: true
            })
        );

        gameFrame.contentWindow.dispatchEvent(
            new KeyboardEvent("keyup", {
                key: letter,
                code: "Key" + letter,
                bubbles: true
            })
        );

    }
}


// ==========================================
// CHEAT LIBRARY
// ==========================================

const GTA_CHEATS = {

    // PLAYER
    health: "ASPIRINE",
    armor: "PRECIOUSPROTECTION",

    // WEAPONS
    weapons1: "THUGSTOOLS",
    weapons2: "PROFESSIONALTOOLS",
    weapons3: "NUTTERTOOLS",

    // WANTED LEVEL
    wantedUp: "YOUWONTTAKEMEALIVE",
    wantedDown: "LEAVEMEALONE",

    // VEHICLES
    tank: "PANZER",

    // VEHICLE / TRAFFIC
    carsFly: "COMEFLYWITHME",
    betterHandling: "GRIPISEVERYTHING",
    aggressiveDrivers: "MIAMITRAFFIC",
    trafficChaos: "TRAVELINSTYLE",

    // WEATHER
    sunny: "ALOVELYDAY",
    verySunny: "APLEASANTDAY",
    cloudy: "ABITDRIEG",
    foggy: "CANTSEEATHING",
    rainy: "CATSANDDOGS",

    // TIME / GAMEPLAY
    fasterClock: "LIFEISPASSINGMEBY",
    fastGameplay: "ONSPEED",
    slowGameplay: "BOOOOOORING",

    // CHARACTER
    ladiesFollow: "FANNYMAGNET",
    womenArmed: "CHICKSWITHGUNS",
    pedsWeapons: "OURGODGIVENRIGHTTOBEARARMS",
    riot: "FIGHTFIGHTFIGHT",
    pedsHate: "NOBODYLIKESME",
    pedsAttack: "ITSALLGOINGMAAAD",

    // VEHICLES / WORLD
    blackCars: "IWANTITPAINTEDBLACK",
    pinkCars: "AHAIRDRESSERSCAR",
    invisibleCars: "WHEELSAREALLINEED",

    // FUN
    bigHead: "DEEPFRIEDMARSBARS",
    smokeEffect: "AIRSHIP"
};


// ==========================================
// CONNECT BUTTONS
// ==========================================

document.querySelectorAll(".cheat-btn").forEach(button => {

    button.addEventListener("click", function () {

        const cheatName = this.dataset.cheat;
        const cheatCode = GTA_CHEATS[cheatName];

        if (!cheatCode) {
            console.warn("Cheat not found:", cheatName);
            return;
        }

        console.log(
            `Activating cheat: ${cheatName} → ${cheatCode}`
        );

        sendCheat(cheatCode);

    });

});