// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    get,
    set,
    update,
    onValue
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBlpR4X-MoGhi_lvcc8WcDJaVSWPOQE6og",
    authDomain: "pixelplay-112a2.firebaseapp.com",
    projectId: "pixelplay-112a2",
    storageBucket: "pixelplay-112a2.firebasestorage.app",
    messagingSenderId: "843007051858",
    appId: "1:843007051858:web:b783a55cf148fa7173f78b",
    measurementId: "G-3TP95X610X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

window.loginGoogle = () => {
    signInWithPopup(auth, provider);
};

window.logoutUser = () => {
    signOut(auth);
};

onAuthStateChanged(auth, (user) => {

    // Favorites page
    if (typeof window.loadUserFavorites === "function") {
        window.loadUserFavorites(user);
    }

    if (typeof window.updateFavoriteButtons === "function") {
        window.updateFavoriteButtons(user);
    }

    const loginBtn = document.getElementById("loginBtn");
    const profileMenu = document.getElementById("profileMenu");
    const userName = document.getElementById("userName");
    const userPhoto = document.getElementById("userPhoto");

    if (!loginBtn || !profileMenu) return;

    if (user) {

        const userRef = ref(db, "users/" + user.uid);

        get(userRef).then((snapshot) => {

            if (!snapshot.exists()) {

                set(userRef, {

                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                    favorites: {},
                    createdAt: Date.now()

                });

            }

        });

        user.photoURL ||
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(user.displayName);

        loginBtn.style.display = "none";
        profileMenu.style.display = "flex";

        // userName.textContent = user.displayName || "Player";

        document.getElementById("dropdownName").textContent =
            user.displayName || "Player";

        document.getElementById("dropdownEmail").textContent =
            user.email;

        document.getElementById("dropdownPhoto").src =
            user.photoURL ||
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(user.displayName || "Player");

        userPhoto.src = user.photoURL ||
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(user.displayName || "Player");

    } else {

        loginBtn.style.display = "inline-flex";

        profileMenu.style.display = "none";
    }

});

const profileMenu = document.getElementById("profileMenu");
const profileDropdown = document.getElementById("profileDropdown");

if (profileMenu && profileDropdown) {

    profileMenu.addEventListener("click", (e) => {

        e.stopPropagation();

        profileDropdown.classList.toggle("show");

    });

    document.addEventListener("click", () => {

        profileDropdown.classList.remove("show");

    });

}

document.getElementById("logoutBtn").onclick = () => {

    logoutUser();

};

// ==========================================
// FAVORITES SYSTEM
// ==========================================

window.toggleFavorite = async function (gameId, gameData) {

    const user = auth.currentUser;

    // ==========================
    // NOT LOGGED IN
    // ==========================

    if (!user) {

        if (typeof window.showLoginModal === "function") {

            window.showLoginModal();

        } else {

            console.log("Login required.");

        }

        return null;

    }

    // ==========================
    // FAVORITE REFERENCE
    // ==========================

    const favoriteRef = ref(
        db,
        "users/" + user.uid + "/favorites/" + gameId
    );

    try {

        const snapshot = await get(favoriteRef);

        // ==========================
        // REMOVE FAVORITE
        // ==========================

        if (snapshot.exists()) {

            await set(favoriteRef, null);

            return false;

        }

        // ==========================
        // ADD FAVORITE
        // ==========================

        await set(favoriteRef, {

            name: gameData.name,
            image: gameData.image,
            page: gameData.page,
            genre: gameData.genre,
            platform: gameData.platform,
            addedAt: Date.now()

        });

        return true;

    } catch (error) {

        console.error("Firebase favorite error:", error);

        return null;

    }

};

// ==========================================
// TEKKEN 3 FAVORITE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const favoriteBtn = document.getElementById("tekkenFavorite");

    if (!favoriteBtn) return;

    const icon = favoriteBtn.querySelector("i");

    favoriteBtn.addEventListener("click", async () => {

        const saved = await toggleFavorite("tekken3", {

            name: "Tekken 3",
            image: "images/tekken3.jpg",
            page: "tekken3.html",
            genre: "Fighting",
            platform: "PlayStation"

        });

        if (saved === undefined) return;

        if (saved) {

            favoriteBtn.classList.add("active");

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

        } else {

            favoriteBtn.classList.remove("active");

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

        }

    });

});


// ==========================================
// FAVORITES PAGE HELPERS
// ==========================================

window.firebaseAuth = auth;

window.firebaseFavoritesRef = function (uid) {

    return ref(
        db,
        "users/" + uid + "/favorites"
    );

};

window.firebaseOnValue = function (favoriteRef, callback) {

    import("https://www.gstatic.com/firebasejs/12.17.0/firebase-database.js")
        .then(({ onValue }) => {

            onValue(favoriteRef, callback);

        });

};

window.firebaseRemoveFavorite = async function (gameId) {

    const user = auth.currentUser;

    if (!user) return;

    const favoriteRef = ref(
        db,
        "users/" + user.uid + "/favorites/" + gameId
    );

    await set(favoriteRef, null);

};