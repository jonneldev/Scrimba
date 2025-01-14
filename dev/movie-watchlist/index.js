const movieSearchInput = document.getElementById("search-input");
const movieSearchBtn = document.getElementById("search-btn");
let moviesContainer = document.getElementById("movies-container");

movieSearchBtn.addEventListener("click", async () => {
    let movieTitle = movieSearchInput.value;

    try {
        // Fetch the list of movies based on the search term
        const searchResponse = await fetch(`http://www.omdbapi.com/?apikey=8f54c801&s=${movieTitle}`);
        const searchData = await searchResponse.json();

        if (searchData.Response === "False") {
            console.error("Error:", searchData.Error);
            return; // Exit if no movies are found
        }

        // Loop through each movie and fetch additional details
        const movieDetailsPromises = searchData.Search.map(async (movie) => {
            const movieResponse = await fetch(`http://www.omdbapi.com/?apikey=8f54c801&i=${movie.imdbID}`);
            return await movieResponse.json();
        });

        // Wait for all the details to be fetched
        const moviesDetails = await Promise.all(movieDetailsPromises);

        // Display the movies or log them
        moviesContainer.innerHTML = "";
        movieSearchInput.value = "";
        console.log(moviesDetails);
        moviesDetails.forEach((movie) => {
            const movieElement = document.createElement("div");
            movieElement.className = "movie-item";
            movieElement.innerHTML = 
            `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <div class="movie-info">
                    <div>
                        <h2>${movie.Title}</h2>
                        <p class="movie-title">⭐ ${movie.imdbRating}</p>
                    </div>
                    <div>
                        <p class="movie-runtime">${movie.Runtime}</p>
                        <p class="movie-genre">${movie.Genre}</p>
                        <button>+</button>
                        <label>Watchlist</label>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
\            `;
            moviesContainer.appendChild(movieElement);
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
});