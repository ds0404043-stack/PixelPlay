// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

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

window.loginGoogle = () => {
    signInWithPopup(auth, provider);
};

window.logoutUser = () => {
    signOut(auth);
};

onAuthStateChanged(auth, (user) => {

    const loginBtn = document.getElementById("loginBtn");
    const profileMenu = document.getElementById("profileMenu");
    const userName = document.getElementById("userName");
    const userPhoto = document.getElementById("userPhoto");

    if (!loginBtn || !profileMenu) return;

    if (user) {
        
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