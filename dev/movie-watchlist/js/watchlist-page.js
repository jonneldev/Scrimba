document.addEventListener("DOMContentLoaded", () => {

    const movieWatchlistContainer = document.getElementById("movie-watchlist-container")

    const displayWatchlist = async () => {

        const movieWatchlist = 
            await JSON.parse(localStorage.getItem("myWatchlist"))
        
            
        if (movieWatchlist === null) {
            console.log("empty watchlist")
            return
        }

        const fragment = document.createDocumentFragment();
        movieWatchlistContainer.innerHTML = ""

        movieWatchlist.forEach((movie) => {
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie-item");

            movieDiv.innerHTML = `
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
                <div class="movie-info">
                    <div>
                        <h2>${movie.Title}</h2>
                        <p class="movie-title">⭐ ${movie.imdbRating}</p>
                    </div>
                    <div>
                        <p class="movie-runtime">${movie.Runtime}</p>
                        <p class="movie-genre">${movie.Genre}</p>
                        <button data-movie-id="${movie.imdbID}" class="remove-movie-btn">Remove</button>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            `;

            fragment.appendChild(movieDiv);
        });
        movieWatchlistContainer.appendChild(fragment);

    }
     

    displayWatchlist()
    

})