const gameSearchInput = document.getElementById("gameSearch");
const gameCards = document.querySelectorAll(".games-grid .game-card");

gameSearchInput.addEventListener("keyup", () => {

    const value = gameSearchInput.value.toLowerCase();

    gameCards.forEach(card => {

        const title = card.querySelector("h3").textContent.toLowerCase();

        if (title.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});

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

counter.textContent = document.querySelectorAll(".games-grid .game-card").length;

document.querySelectorAll(".favorite").forEach(btn=>{

    btn.addEventListener("click",()=>{

        btn.classList.toggle("active");

        const icon = btn.querySelector("i");

        icon.classList.toggle("fa-regular");
        icon.classList.toggle("fa-solid");

    });

});

// ===========================
// SORT GAMES
// ===========================

const sortSelect = document.getElementById("sortGames");
const gamesGrid = document.querySelector(".games-grid");

sortSelect.addEventListener("change", () => {

    const cards = [...document.querySelectorAll(".game-card")];

    if(sortSelect.value === "az"){

        cards.sort((a,b)=>{

            return a.querySelector("h3").textContent.localeCompare(
                b.querySelector("h3").textContent
            );

        });

    }

    else if(sortSelect.value === "rating"){

        cards.sort((a,b)=>{

            const ratingA = parseFloat(
                a.querySelector(".rating").textContent.replace(/[^\d.]/g,"")
            ) || 0;

            const ratingB = parseFloat(
                b.querySelector(".rating").textContent.replace(/[^\d.]/g,"")
            ) || 0;

            return ratingB-ratingA;

        });

    }

    else if(sortSelect.value === "year"){

        cards.sort((a,b)=>{

            return Number(
                b.querySelector(".year").textContent
            ) - Number(
                a.querySelector(".year").textContent
            );

        });

    }

    cards.forEach(card=>gamesGrid.appendChild(card));

});



// ===========================
// LOAD MORE
// ===========================

const cards = document.querySelectorAll(".game-card");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let visibleCards = 2;

if(cards.length <= visibleCards){

    loadMoreBtn.style.display = "none";

}

cards.forEach((card,index)=>{

    if(index >= visibleCards){

        card.style.display = "none";

    }

});

loadMoreBtn.addEventListener("click",()=>{

    visibleCards += 6;

    cards.forEach((card,index)=>{

        if(index < visibleCards){

            card.style.display = "flex";

        }

    });

    if(visibleCards >= cards.length){

        loadMoreBtn.style.display = "none";

    }

});