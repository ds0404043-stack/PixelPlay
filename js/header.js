// ==========================
// MOBILE MENU
// ==========================
const menuBtn = document.querySelector(".menu-btn");
const closeBtn = document.querySelector(".close-btn");
const mobileMenu = document.querySelector(".mobile-menu");
const menuOverlay = document.querySelector(".overlay");

function openMenu() {
    mobileMenu.classList.add("active");
    menuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeMenu() {
    mobileMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

menuBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", closeMenu);

document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMenu();
    }
});