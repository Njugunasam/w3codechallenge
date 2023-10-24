let films = [];
let currentMovie;

document.addEventListener("DOMContentLoaded", function () {
    patchFilms();
});

async function patchFilms() {
    try {
        const response = await fetch("  http://localhost:3000/films");
        const data = await response.json();
        films = data.films;
        displayFilmList();
        currentMovie = films[0];
        displayMovieDetails(currentMovie);
    } catch (error) {
        console.error("Error fetching films:", error);
    }
}

function displayMovieDetails(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;
    const movieDetailsContainer = document.querySelector("#movie-details");
    movieDetailsContainer.innerHTML = `
        <div class="card" data-id="${movie.id}">
            <img src="${movie.poster}" height="250px" class="card-img-top image" alt="...">
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <span class="card-text">
                    <ul>
                        <li>Showtime: ${movie.showtime}</li>
                        <li>Runtime: ${movie.runtime} minutes</li>
                        <li>Available Tickets: ${availableTickets}</li>
                    </ul>
                </span>
                <form class="w-100">
                    <label>Tickets</label>
                    <input type="number" min="1" max="${availableTickets}" value="1" />
                    <button type="button" class="mx-auto w-100 btn btn-primary m-2">Buy Ticket</button>
                </form>
            </div>
        </div>
    `;
    currentMovie = movie;
}

function displayFilmList() {
    const filmsListContainer = document.querySelector("#films");

    films.forEach((film) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = film.title;
        listItem.addEventListener("click", () => {
            displayMovieDetails(film);
        });
        filmsListContainer.appendChild(listItem);
    });
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-primary")) {
        const card = event.target.closest(".card");
        if (card) {
            const movieId = card.getAttribute("data-id");
            const movie = films.find((film) => film.id === movieId);
            if (movie) {
                const availableTickets = movie.capacity - movie.tickets_sold;
                const ticketInput = card.querySelector("input[type=number]");
                const numTickets = parseInt(ticketInput.value);
                if (numTickets > 0 && numTickets <= availableTickets) {
                    movie.tickets_sold += numTickets;
                    displayMovieDetails(movie);
                }
            }
        }
    }
});
