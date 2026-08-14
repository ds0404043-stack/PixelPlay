const gameSearchInput = document.getElementById("gameSearch");
const gameCards = document.querySelectorAll(".games-grid .game-card");

if (gameSearchInput) {

    gameSearchInput.addEventListener("keyup", () => {

        const value = gameSearchInput.value.toLowerCase();

        gameCards.forEach(card => {

            const title = card.querySelector("h3").textContent.toLowerCase();

            card.style.display = title.includes(value)
                ? "block"
                : "none";

        });

    });

}

const buttons = document.querySelectorAll(".category-btn");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        gameCards.forEach(card => {

            if (
                filter === "all" ||
                card.dataset.category === filter
            ) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});


const counter = document.getElementById("gameCount");

if (counter) {
    counter.textContent =
        document.querySelectorAll(".games-grid .game-card").length;
}

// ==========================================
// FAVORITES
// ==========================================

document.querySelectorAll(".favorite").forEach(btn => {

    btn.addEventListener("click", async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const card = btn.closest(".game-card");

        if (!card) return;

        const titleElement = card.querySelector("h3");
        const imageElement = card.querySelector("img");

        if (!titleElement || !imageElement) return;

        const title = titleElement.textContent.trim();

        const image = imageElement.getAttribute("src");

        const genre = card.dataset.category || "Unknown";

        const platform =
            card.querySelector(".platform-tag")?.textContent.trim() ||
            "Browser";

        const page =
            card.querySelector(".play-btn-small")?.getAttribute("href") ||
            "#";

        const gameId = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        // Firebase must be loaded
        if (typeof window.toggleFavorite !== "function") {

            console.error("Firebase favorite system is not loaded.");

            return;

        }

        try {

            const saved = await window.toggleFavorite(gameId, {

                name: title,
                image: image,
                page: page,
                genre: genre,
                platform: platform

            });

            // User was not logged in
            if (saved === null) return;

            const icon = btn.querySelector("i");

            if (!icon) return;

            if (saved) {

                btn.classList.add("active");

                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");

            } else {

                btn.classList.remove("active");

                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");

            }

        } catch (error) {

            console.error("Favorite error:", error);

        }

    });

});

// ==========================================
// LOAD SAVED FAVORITES
// ==========================================

window.updateFavoriteButtons = function (user) {

    if (!user) return;

    if (typeof window.firebaseFavoritesRef !== "function") {
        return;
    }

    if (typeof window.firebaseOnValue !== "function") {
        return;
    }


    const favoritesRef =
        window.firebaseFavoritesRef(user.uid);


    window.firebaseOnValue(favoritesRef, (snapshot) => {

        const favorites = snapshot.val() || {};


        document.querySelectorAll(".game-card").forEach(card => {

            const favoriteBtn =
                card.querySelector(".favorite");

            if (!favoriteBtn) return;


            const icon =
                favoriteBtn.querySelector("i");

            if (!icon) return;


            const titleElement =
                card.querySelector("h3");

            if (!titleElement) return;


            const title =
                titleElement.textContent.trim();


            const gameId = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");


            const isFavorite =
                !!favorites[gameId];


            if (isFavorite) {

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

};

// ===========================
// SORT GAMES
// ===========================

const sortSelect = document.getElementById("sortGames");
const gamesGrid = document.querySelector(".games-grid");

sortSelect.addEventListener("change", () => {

    const cards = [...document.querySelectorAll(".game-card")];

    if (sortSelect.value === "az") {

        cards.sort((a, b) => {

            return a.querySelector("h3").textContent.localeCompare(
                b.querySelector("h3").textContent
            );

        });

    }

    else if (sortSelect.value === "rating") {

        cards.sort((a, b) => {

            const ratingA = parseFloat(
                a.querySelector(".rating").textContent.replace(/[^\d.]/g, "")
            ) || 0;

            const ratingB = parseFloat(
                b.querySelector(".rating").textContent.replace(/[^\d.]/g, "")
            ) || 0;

            return ratingB - ratingA;

        });

    }

    else if (sortSelect.value === "year") {

        cards.sort((a, b) => {

            return Number(
                b.querySelector(".year").textContent
            ) - Number(
                a.querySelector(".year").textContent
            );

        });

    }

    cards.forEach(card => gamesGrid.appendChild(card));

});
