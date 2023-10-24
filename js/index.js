let films = [];
let currentMovie;

// Add an event listener for the "DOMContentLoaded"
document.addEventListener("DOMContentLoaded", function () {
    patchFilms();
});

async function patchFilms() {
    try {
        const response = await fetch("https://my-json-server.typicode.com/Njugunasam/w3codechallenge/films");
        const data = await response.json();
        films = data;
        displayFilmList();
        currentMovie = films[0];
        displayMovieDetails(currentMovie);
    } catch (error) {
        console.error("Error fetching films:", error);
    }
}

// Display information about the movie.
function displayMovieDetails(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;
    const movieDetailsContainer = document.querySelector("#movie-details");
    movieDetailsContainer.innerHTML = `
        <div class="card mb-4" style="max-width: 18rem;" data-id="${movie.id}">
            <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">Showtime: ${movie.showtime}</p>
                <p class="card-text">Runtime: ${movie.runtime} minutes</p>
                <p class="card-text">Available Tickets: ${availableTickets}</p>
                <form>
                    <div class="form-group">
                        <label for="ticketInput">Tickets</label>
                        <input type="number" class="form-control" id="ticketInput" min="1" max="${availableTickets}" value="1" />
                    </div>
                    <button class="btn btn-primary w-100 mt-2">Buy Ticket</button>
                </form>
            </div>
        </div>
    `;
    currentMovie = movie;
}

// Display the list of films 
function displayFilmList() {
    const filmsListContainer = document.querySelector("#films");

    films.forEach((film) => {
        const listItem = document.createElement("li");
        listItem.className = "film item list-group-item";
        listItem.setAttribute("data-id", film.id);
        listItem.textContent = film.title;
        listItem.addEventListener("click", () => {
            displayMovieDetails(film);
        });
        filmsListContainer.appendChild(listItem);
    });
}

// Event listener for the "click" ticket purchases.
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
