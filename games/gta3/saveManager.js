// Create userfiles folder
Module = Module || {};

Module.onRuntimeInitialized = function () {

    try {

        if (!FS.analyzePath("/userfiles").exists) {
            FS.mkdir("/userfiles");
            console.log("✅ /userfiles created");
        } else {
            console.log("✅ /userfiles already exists");
        }

    } catch (e) {
        console.error(e);
    }

};


// ---------- IndexedDB ----------

let saveDB = null;

const request = indexedDB.open("PixelPlay_GTA3_Save", 1);

request.onupgradeneeded = function (event) {
    saveDB = event.target.result;

    if (!saveDB.objectStoreNames.contains("saves")) {
        saveDB.createObjectStore("saves");
    }
};

request.onsuccess = function (event) {
    saveDB = event.target.result;
    console.log("✅ Save database ready");
};

request.onerror = function () {
    console.log("❌ Database error");
};

// ---------- Save to IndexedDB ----------

function backupSave() {

    if (!saveDB) return;

    try {

        if (!FS.analyzePath("/userfiles/GTA3sf1.b").exists) return;

        const data = FS.readFile("/userfiles/GTA3sf1.b");

        const tx = saveDB.transaction("saves", "readwrite");
        const store = tx.objectStore("saves");

        store.put(data, "GTA3sf1.b");

        console.log("✅ Save backed up");

    } catch (e) {
        console.error(e);
    }

}

setInterval(() => {
    backupSave();
}, 3000);

// ---------- Restore Save ----------

function restoreSave() {

    if (!saveDB) return;

    const tx = saveDB.transaction("saves", "readonly");
    const store = tx.objectStore("saves");

    const request = store.get("GTA3sf1.b");

    request.onsuccess = function () {

        if (!request.result) {
            console.log("No save found.");
            return;
        }

        try {

            if (!FS.analyzePath("/userfiles").exists) {
                FS.mkdir("/userfiles");
            }

            if (FS.analyzePath("/userfiles/GTA3sf1.b").exists) {
                FS.unlink("/userfiles/GTA3sf1.b");
            }

            FS.writeFile("/userfiles/GTA3sf1.b", request.result);

            console.log("✅ Save restored");

        } catch (e) {
            console.error(e);
        }

    };

}