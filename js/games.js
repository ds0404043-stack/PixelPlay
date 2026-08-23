/* =========================================================
   PIXADU SHARED GAME CONTROLS
   Favorites + search + categories + sorting
   Works on Games, Arcade and PC pages.
========================================================= */

(() => {
    const cards = () => [...document.querySelectorAll(".games-grid .game-card")];

    // -------------------------
    // SEARCH
    // -------------------------
    const searchInput = document.getElementById("gameSearch");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const value = searchInput.value.trim().toLowerCase();
            cards().forEach(card => {
                const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
                card.style.display = title.includes(value) ? "" : "none";
            });
        });
    }

    // -------------------------
    // CATEGORIES
    // -------------------------
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;
            cards().forEach(card => {
                card.style.display =
                    filter === "all" || card.dataset.category === filter ? "" : "none";
            });
        });
    });

    // -------------------------
    // COUNTER
    // -------------------------
    const counter = document.getElementById("gameCount");
    if (counter) counter.textContent = cards().length;

    // -------------------------
    // FAVORITES
    // -------------------------
    document.querySelectorAll(".favorite").forEach(button => {
        button.addEventListener("click", async event => {
            event.preventDefault();
            event.stopPropagation();

            const card = button.closest(".game-card");
            if (!card) return;

            const title = card.querySelector("h3")?.textContent.trim();
            const image = card.querySelector("img")?.getAttribute("src");
            if (!title || !image) return;

            const genre = card.dataset.category ||
                card.querySelector(".game-tag")?.textContent.trim() || "Game";
            const platform = card.querySelector(".platform-tag")?.textContent.trim() || "Browser";
            const page = card.querySelector(".play-btn-small")?.getAttribute("href") || "#";
            const gameId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

            // Firebase module normally loads before the user can click.
            // If it is still loading, wait briefly instead of failing silently.
            let tries = 0;
            while (typeof window.toggleFavorite !== "function" && tries < 30) {
                await new Promise(resolve => setTimeout(resolve, 50));
                tries++;
            }

            if (typeof window.toggleFavorite !== "function") {
                console.error("Pixadu: Firebase favorite system is not loaded.");
                return;
            }

            try {
                const saved = await window.toggleFavorite(gameId, {
                    name: title,
                    image,
                    page,
                    genre,
                    platform
                });

                // Not logged in: Firebase opens the login modal.
                if (saved === null || saved === undefined) return;

                const icon = button.querySelector("i");
                if (!icon) return;

                button.classList.toggle("active", saved);
                icon.classList.toggle("fa-solid", saved);
                icon.classList.toggle("fa-regular", !saved);
            } catch (error) {
                console.error("Pixadu favorite error:", error);
            }
        });
    });

    // -------------------------
    // SORT
    // -------------------------
    const sortSelect = document.getElementById("sortGames");
    const grid = document.querySelector(".games-grid");

    if (sortSelect && grid) {
        sortSelect.addEventListener("change", () => {
            const sorted = cards();

            if (sortSelect.value === "az") {
                sorted.sort((a, b) =>
                    (a.querySelector("h3")?.textContent || "").localeCompare(
                        b.querySelector("h3")?.textContent || ""
                    )
                );
            } else if (sortSelect.value === "rating") {
                sorted.sort((a, b) => {
                    const ra = parseFloat(a.querySelector(".rating")?.textContent.replace(/[^\d.]/g, "")) || 0;
                    const rb = parseFloat(b.querySelector(".rating")?.textContent.replace(/[^\d.]/g, "")) || 0;
                    return rb - ra;
                });
            } else if (sortSelect.value === "year") {
                sorted.sort((a, b) => {
                    const ya = parseInt(a.querySelector(".year")?.textContent || "0", 10) || 0;
                    const yb = parseInt(b.querySelector(".year")?.textContent || "0", 10) || 0;
                    return yb - ya;
                });
            }

            sorted.forEach(card => grid.appendChild(card));
        });
    }
})();
