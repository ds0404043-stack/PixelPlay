// ==========================================
// GTA VICE CITY - COMPLETE CHEAT LIBRARY
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
// COMPLETE CHEAT LIBRARY
// ==========================================

const GTA_CHEATS = {

    // PLAYER
    health: "ASPIRINE",
    armor: "PRECIOUSPROTECTION",
    suicide: "ICANTTAKEITANYMORE",
    fat: "DEEPFRIEDMARSBARS",
    skinny: "PROGRAMMER",
    smoking: "CERTAINDEATH",

    // WEAPONS
    weaponsLight: "THUGSTOOLS",
    weaponsMedium: "PROFESSIONALTOOLS",
    weaponsHeavy: "NUTTERTOOLS",

    // VEHICLES
    tank: "PANZER",
    bloodring: "TRAVELINSTYLE",
    bloodringV2: "GETTHEREQUICKLY",
    caddy: "BETTERTHANWALKING",
    hotring: "GETTHEREVERYFASTINDEED",
    hotringV2: "GETTHEREAMAZINGLYFAST",
    hearse: "THELASTRIDE",
    sabreTurbo: "GETTHEREFAST",
    garbageTruck: "RUBBISHCAR",
    limousine: "ROCKANDROLLCAR",

    // VEHICLE EFFECTS
    blowUpCars: "BIGBANG",
    perfectHandling: "GRIPISEVERYTHING",
    invisibleCars: "WHEELSAREALLINEED",
    boatsFly: "AIRSHIP",
    flyingCars: "COMEFLYWITHME",
    carsOnWater: "SEAWAYS",
    hugeWheels: "LOADSOFLITTLETHINGS",

    // TRAFFIC
    aggressiveDrivers: "MIAMITRAFFIC",
    blackTraffic: "IWANTITPAINTEDBLACK",
    pinkTraffic: "AHAIRDRESSERSCAR",
    greenLights: "GREENLIGHT",

    // PEDESTRIANS
    gangGirls: "CHICKSWITHGUNS",
    armedPedestrians: "OURGODGIVENRIGHTTOBEARARMS",
    womenEnterCars: "HOPINGIRL",
    aggressivePedestrians: "NOBODYLIKESME",
    pedestrianRiot: "FIGHTFIGHTFIGHT",
    womenChase: "FANNYMAGNET",

    // WANTED LEVEL
    wantedUp: "YOUWONTTAKEMEALIVE",
    wantedDown: "LEAVEMEALONE",
    mediaLevel: "CHASESTAT",

    // GAMEPLAY
    fastMotion: "ONSPEED",
    slowMotion: "BOOOOOORING",
    fastClock: "LIFEISPASSINGMEBY",

    // WEATHER
    rainy: "CATSANDDOGS",
    sunny: "ALOVELYDAY",
    partlyCloudy: "APLEASANTDAY",
    veryCloudy: "ABITDRIEG",
    foggy: "CANTSEEATHING",

    // CHARACTER SKINS
    hilary: "LOOKLIKEHILARY",
    lance: "LOOKLIKELANCE",
    dick: "WELOVEOURDICK",
    ken: "MYSONISALAWYER",
    jezz: "ROCKANDROLLMAN",
    candy: "IWANTBIGTITS",
    mercedes: "FOXYLITTLETHING",
    phil: "ONEARMEDBANDIT",
    diaz: "CHEATSHAVEBEENCRACKED",
    sonny: "IDONTHAVETHEMONEYSONNY"
};


// ==========================================
// CONNECT ALL CHEAT BUTTONS
// ==========================================

document.querySelectorAll(".cheat-btn").forEach(button => {

    button.addEventListener("click", function () {

        const cheatName = this.dataset.cheat;
        const cheatCode = GTA_CHEATS[cheatName];

        if (!cheatCode) {

            console.warn(
                "Cheat not found:",
                cheatName
            );

            return;
        }

        console.log(
            "Activating cheat:",
            cheatName,
            "→",
            cheatCode
        );

        sendCheat(cheatCode);

    });

});