document.addEventListener("DOMContentLoaded", () => {

    const inputs = [
        document.getElementById("searchInput"),
        document.getElementById("mobileSearchInput")
    ].filter(Boolean);

    if (!inputs.length) return;

    inputs.forEach(input => {

        const dropdown = document.createElement("div");
        dropdown.className = "searchDropdown";

        input.parentElement.style.position = "relative";
        input.parentElement.appendChild(dropdown);

        input.addEventListener("input", () => {

            const query = input.value.trim().toLowerCase();

            dropdown.innerHTML = "";

            if (!query) {
                dropdown.style.display = "none";
                return;
            }

            const results = gamesDatabase.filter(game => {

                const text = (
                    game.name +
                    " " +
                    game.genre +
                    " " +
                    game.platform +
                    " " +
                    game.keywords.join(" ")
                ).toLowerCase();

                return text.includes(query);

            });

            if (results.length === 0) {

                dropdown.innerHTML = `
                    <div class="no-results">
                        No games found
                    </div>
                `;

                dropdown.style.display = "block";
                return;
            }

            results.forEach(game => {

                const item = document.createElement("a");

                item.className = "search-item";
                item.href = game.page;

                item.innerHTML = `
                    <img src="${game.image}" alt="${game.name}">
                    <div>
                        <h4>${game.name}</h4>
                        <span>${game.genre} • ${game.platform}</span>
                    </div>
                `;

                dropdown.appendChild(item);

            });

            dropdown.style.display = "block";

        });

    });

    document.addEventListener("click", e => {

        if (
            !e.target.closest(".search-box") &&
            !e.target.closest(".mobile-search")
        ) {

            document.querySelectorAll(".searchDropdown").forEach(dropdown => {

                dropdown.style.display = "none";

            });

        }

    });

});