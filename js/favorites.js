// ==========================================
// PIXELPLAY FAVORITES PAGE
// ==========================================

const favoritesGrid = document.getElementById("favoritesGrid");
const favoriteCount = document.getElementById("favoriteCount");
const emptyFavorites = document.getElementById("emptyFavorites");


// ==========================================
// LOAD USER FAVORITES
// ==========================================

window.loadUserFavorites = function (user) {

    favoritesGrid.innerHTML = "";

    if (!user) {

        favoriteCount.textContent = "0";

        emptyFavorites.style.display = "block";

        return;

    }

    const favoritesRef = window.firebaseFavoritesRef(user.uid);

    window.firebaseOnValue(favoritesRef, (snapshot) => {

        favoritesGrid.innerHTML = "";

        const data = snapshot.val();

        if (!data) {

            favoriteCount.textContent = "0";

            emptyFavorites.style.display = "block";

            return;

        }

        emptyFavorites.style.display = "none";

        const games = Object.entries(data);

        favoriteCount.textContent = games.length;

        games.forEach(([gameId, game]) => {

            favoritesGrid.innerHTML += `

                <div class="game-card" data-game-id="${gameId}">

                    <div class="image-wrapper">

                        <img src="${game.image}" alt="${game.name}">

                    </div>

                    <div class="status-badge live">
                        FAVORITE
                    </div>

                    <div class="game-content">

                        <span class="game-tag">
                            ${game.genre || "Game"}
                        </span>

                        <span class="platform-tag">
                            ${game.platform || "Browser"}
                        </span>

                        <h3>${game.name}</h3>

                        <div class="game-bottom">

                            <a href="${game.page}" class="play-btn-small">
                                ▶ Play
                            </a>

                            <button
                                class="favorite remove-favorite active"
                                data-game-id="${gameId}"
                                title="Remove from favorites"
                            >
                                <i class="fa-solid fa-heart"></i>
                            </button>

                        </div>

                    </div>

                </div>

            `;

        });

        document.querySelectorAll(".remove-favorite").forEach(btn => {

            btn.addEventListener("click", async () => {

                const gameId = btn.dataset.gameId;

                await window.firebaseRemoveFavorite(gameId);

            });

        });

    });

};


// ==========================================
// WAIT FOR FIREBASE LOGIN STATE
// ==========================================

window.firebaseReady = function () {

    if (window.firebaseAuth?.currentUser) {

        window.loadUserFavorites();

    }

};