// ==========================
// FIREBASE SDK
// ==========================

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
    onValue
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-database.js";


// ==========================
// FIREBASE CONFIG
// ==========================

const firebaseConfig = {
    apiKey: "AIzaSyBlpR4X-MoGhi_lvcc8WcDJaVSWPOQE6og",
    authDomain: "pixelplay-112a2.firebaseapp.com",
    projectId: "pixelplay-112a2",
    storageBucket: "pixelplay-112a2.firebasestorage.app",
    messagingSenderId: "843007051858",
    appId: "1:843007051858:web:b783a55cf148fa7173f78b",
    measurementId: "G-3TP95X610X"
};


// ==========================
// INITIALIZE FIREBASE
// ==========================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);


// ==========================
// GOOGLE LOGIN
// ==========================

window.loginGoogle = async () => {

    try {

        await signInWithPopup(auth, provider);

    } catch (error) {

        console.error("Google login failed:", error);

        if (error.code === "auth/popup-closed-by-user") {
            return;
        }

        if (error.code === "auth/popup-blocked") {
            alert(
                "Google login popup was blocked. Please allow popups for Pixadu."
            );
            return;
        }

        if (error.code === "auth/unauthorized-domain") {
            alert(
                "This website is not authorized for Google login in Firebase."
            );
            return;
        }

        alert(
            "Google login failed. Check the browser console for the exact error."
        );
    }
};


// ==========================
// LOGOUT
// ==========================

window.logoutUser = () => {
    signOut(auth);
};


// ==========================
// AUTH STATE
// ==========================

onAuthStateChanged(auth, (user) => {

    // Favorites page
    if (typeof window.loadUserFavorites === "function") {
        window.loadUserFavorites(user);
    }

    // Game favorites
    if (typeof window.updateFavoriteButtons === "function") {
        window.updateFavoriteButtons(user);
    }


    const loginBtn = document.getElementById("loginBtn");
    const profileMenu = document.getElementById("profileMenu");
    const userName = document.getElementById("userName");
    const userPhoto = document.getElementById("userPhoto");

    if (!loginBtn || !profileMenu) {
        return;
    }


    // ==========================
    // USER LOGGED IN
    // ==========================

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


        const photo =
            user.photoURL ||
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(user.displayName || "Player");


        loginBtn.style.display = "none";
        profileMenu.style.display = "flex";


        if (userName) {
            userName.textContent = user.displayName || "Player";
        }


        const dropdownName =
            document.getElementById("dropdownName");

        const dropdownEmail =
            document.getElementById("dropdownEmail");

        const dropdownPhoto =
            document.getElementById("dropdownPhoto");


        if (dropdownName) {
            dropdownName.textContent =
                user.displayName || "Player";
        }

        if (dropdownEmail) {
            dropdownEmail.textContent =
                user.email || "";
        }

        if (dropdownPhoto) {
            dropdownPhoto.src = photo;
        }

        if (userPhoto) {
            userPhoto.src = photo;
        }

    }


    // ==========================
    // USER LOGGED OUT
    // ==========================

    else {

        loginBtn.style.display = "inline-flex";
        profileMenu.style.display = "none";

    }

});


// ==========================
// PROFILE DROPDOWN
// ==========================

const profileMenu =
    document.getElementById("profileMenu");

const profileDropdown =
    document.getElementById("profileDropdown");


if (profileMenu && profileDropdown) {

    profileMenu.addEventListener("click", (e) => {

        e.stopPropagation();

        profileDropdown.classList.toggle("show");

    });


    document.addEventListener("click", () => {

        profileDropdown.classList.remove("show");

    });

}


// ==========================
// LOGOUT BUTTON
// ==========================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.onclick = () => {
        logoutUser();
    };

}

// ==========================
// FAVORITE POPUP
// ==========================

window.showFavoritePopup = function (gameName, added = true) {

    const popup = document.createElement("div");

    popup.innerHTML = `
        <div style="
            font-size:24px;
            width:48px;
            height:48px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:rgba(255,255,255,0.08);
            border-radius:14px;
        ">
            ${added ? "❤️" : "💔"}
        </div>

        <div style="
            display:flex;
            flex-direction:column;
            gap:4px;
            flex:1;
        ">
            <strong style="font-size:15px;">
                ${added ? "Added to Favorites" : "Removed from Favorites"}
            </strong>

            <span style="
                font-size:13px;
                color:#aaa;
            ">
                ${gameName}
            </span>
        </div>

        <button style="
            border:none;
            background:none;
            color:#aaa;
            font-size:24px;
            cursor:pointer;
        ">×</button>
    `;

    Object.assign(popup.style, {
        position: "fixed",
        top: "25px",
        right: "25px",
        zIndex: "999999",
        width: "min(380px, calc(100% - 30px))",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px",
        background: "rgba(15,15,22,0.97)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "18px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        transform: "translateX(120%)",
        opacity: "0",
        transition: "0.35s ease"
    });

    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.style.transform = "translateX(0)";
        popup.style.opacity = "1";
    });

    const closePopup = () => {
        popup.style.transform = "translateX(120%)";
        popup.style.opacity = "0";

        setTimeout(() => popup.remove(), 350);
    };

    popup.querySelector("button").onclick = closePopup;

    setTimeout(closePopup, 3500);
};


// ==========================
// FAVORITES SYSTEM
// ==========================

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


    const favoriteRef =
        ref(
            db,
            "users/" +
            user.uid +
            "/favorites/" +
            gameId
        );


    try {

        const snapshot =
            await get(favoriteRef);


        // ==========================
        // REMOVE FAVORITE
        // ==========================

        if (snapshot.exists()) {

            await set(favoriteRef, null);

            window.showFavoritePopup(
                gameData.name,
                false
            );

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

        window.showFavoritePopup(
            gameData.name,
            true
        );

        return true;


        return true;


    } catch (error) {

        console.error(
            "Firebase favorite error:",
            error
        );

        return null;
    }

};


// ==========================
// TEKKEN 3 FAVORITE
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const favoriteBtn =
        document.getElementById("tekkenFavorite");


    if (!favoriteBtn) {
        return;
    }


    const icon =
        favoriteBtn.querySelector("i");


    favoriteBtn.addEventListener(
        "click",
        async () => {

            const saved =
                await toggleFavorite(
                    "tekken3",
                    {
                        name: "Tekken 3",
                        image: "images/tekken3.jpg",
                        page: "tekken3.html",
                        genre: "Fighting",
                        platform: "PlayStation"
                    }
                );


            if (saved === undefined) {
                return;
            }


            if (saved) {

                favoriteBtn.classList.add("active");

                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");

            } else {

                favoriteBtn.classList.remove("active");

                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");

            }

        }
    );

});


// ==========================
// FAVORITES PAGE HELPERS
// ==========================

window.firebaseAuth = auth;


window.firebaseFavoritesRef = function (uid) {

    return ref(
        db,
        "users/" +
        uid +
        "/favorites"
    );

};


window.firebaseOnValue = function (
    favoriteRef,
    callback
) {

    onValue(
        favoriteRef,
        callback
    );

};


window.firebaseRemoveFavorite = async function (gameId) {

    const user = auth.currentUser;


    if (!user) {
        return;
    }


    const favoriteRef =
        ref(
            db,
            "users/" +
            user.uid +
            "/favorites/" +
            gameId
        );


    await set(
        favoriteRef,
        null
    );

    window.showFavoritePopup(
        "Favorite removed",
        false
    );

};