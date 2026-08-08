// ==========================================
// PIXELPLAY LOGIN MODAL
// ==========================================

const loginModal = document.getElementById("loginModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const modalLaterBtn = document.getElementById("modalLaterBtn");
const modalLoginBtn = document.getElementById("modalLoginBtn");


// OPEN MODAL
window.showLoginModal = function () {

    if (!loginModal) return;

    loginModal.classList.add("show");

    document.body.style.overflow = "hidden";

};


// CLOSE MODAL
function hideLoginModal() {

    if (!loginModal) return;

    loginModal.classList.remove("show");

    document.body.style.overflow = "";

}


// CLOSE BUTTON
if (closeLoginModal) {

    closeLoginModal.addEventListener("click", hideLoginModal);

}


// MAYBE LATER
if (modalLaterBtn) {

    modalLaterBtn.addEventListener("click", hideLoginModal);

}


// CLICK OUTSIDE
if (loginModal) {

    loginModal.addEventListener("click", (e) => {

        if (e.target.classList.contains("login-modal-overlay")) {

            hideLoginModal();

        }

    });

}


// GOOGLE LOGIN
if (modalLoginBtn) {

    modalLoginBtn.addEventListener("click", async () => {

        hideLoginModal();

        if (typeof loginGoogle === "function") {

            loginGoogle();

        }

    });

}