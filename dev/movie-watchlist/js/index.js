document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "apikey=8f54c801";
    const BASE_URL = "http://www.omdbapi.com/?";

    const searchInput = document.getElementById("search-input");
    const moviesContainer = document.getElementById("movies-container");
    const searchBtn = document.getElementById("search-btn");
    const myWatchlist = document.getElementById("my-watchlist")

    let movieWatchlist = []

    const focusSearchInput = () => {
        searchInput.focus();
    };

    const searchMovie = async (movie) => {
        try {
            const url = `${BASE_URL}${API_KEY}&s=${movie}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (data.Response === "False") {
                throw new Error(data.Error || "No results found.");
            }

            return data.Search;
        } catch (error) {
            console.error("Error fetching movie data:", error);
            alert(error.message || "An error occurred while searching for movies.");
            return [];
        }
    };

    const storeData = (dataKey, data) => {
        localStorage.setItem(dataKey, JSON.stringify(data));
    };

    const getData = (data) => {
        const storedResults = localStorage.getItem(`${data}`);
        return storedResults ? JSON.parse(storedResults) : [];
    };


    const displayResults = (results) => {
        moviesContainer.innerHTML = "";

        if (!results || results.length === 0) {
            moviesContainer.innerHTML = `<p>No movies found. Try a different title.</p>`;
            return;
        }

        const fragment = document.createDocumentFragment();

        results.forEach((movie) => {
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie-item");

            movieDiv.innerHTML = `
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
                <div class="movie-info">
                    <div>
                        <h2>${movie.Title}</h2>
                        <p class="movie-title">⭐ ${movie.imdbRating || "N/A"}</p>
                    </div>
                    <div>
                        <p class="movie-runtime">${movie.Runtime || "N/A"}</p>
                        <p class="movie-genre">${movie.Genre || "N/A"}</p>
                        <button data-movie-id="${movie.imdbID}" class="add-movie-btn">+ Watchlist</button>
                    </div>
                    <p class="movie-plot">${movie.Plot || "No plot available."}</p>
                </div>
            `;

            fragment.appendChild(movieDiv);
        });

        moviesContainer.appendChild(fragment);
    };

    const handleSearch = async () => {
        const movieTitle = searchInput.value.trim();

        if (!movieTitle) {
            alert("Please enter a movie title!");
            return;
        }

        try {
            searchBtn.disabled = true;
            searchBtn.textContent = "Loading...";
            const results = await searchMovie(movieTitle);
            searchInput.value = ""
            storeData("searchResults", results);
            displayResults(results);
        } catch (error) {
            console.error("Error during search:", error);
        } finally {
            searchBtn.disabled = false;
            searchBtn.textContent = "Search";
        }
    };


    searchBtn.addEventListener("click", handleSearch);
    document.getElementById("movie-placeholder").addEventListener("click", focusSearchInput);
    
    const addMovieToWatchlist = (movieId) => {
        try {
            // Validate movieId
            if (!movieId) {
                throw new Error("Invalid movie ID.");
            }
    
            // Fetch search results
            const data = getData("searchResults");
            if (!Array.isArray(data)) {
                throw new Error("Search results are not available.");
            }
    
            // Find the movie in search results
            const movie = data.find(result => result.imdbID === movieId);
            if (!movie) {
                throw new Error("Movie not found in search results.");
            }
    
            // Check if the movie is already in the watchlist
            const isAlreadyInWatchlist = movieWatchlist.some(item => item.imdbID === movieId);
            if (isAlreadyInWatchlist) {
                alert("This movie is already in your watchlist.");
                return;
            }
    
            // Add the movie to the watchlist
            movieWatchlist.push(movie);

        } catch (error) {
            console.error(error.message);
            alert("An error occurred while adding the movie to your watchlist. Please try again.");
        }
    };
    
    // Event listener for adding movies
    moviesContainer.addEventListener("click", async (e) => {
        try {
            const addBtn = e.target
            const movieId = e.target.getAttribute("data-movie-id");
            if (movieId) {
                addMovieToWatchlist(movieId);
                storeData("myWatchlist", movieWatchlist)

                // Update the button state  
                addBtn.textContent = "✔ Added";
                addBtn.disabled = true;
                addBtn.style.backgroundColor = "#4CAF50";
            }
        } catch (error) {
            console.error("Error in event listener:", error.message);
        }
    });

    myWatchlist.addEventListener("click", () => {
        window.location.href = "watchlist-page.html";
    });
});