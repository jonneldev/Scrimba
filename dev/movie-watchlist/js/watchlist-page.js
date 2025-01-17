document.addEventListener("DOMException", () => {

    const movieWatchlistContainer = document.getElementById("movie-watchlist-container")


    const displayWatchlist = () => {

        const movieWatchlist = 
        JSON.parse(localStorage.getItem("movieWatchlist"))

        console.log(movieWatchlist)
        console.log(movieWatchlist)
        
        if (movieWatchlist === null) {
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
        console.log(movieWatchlist)
        movieWatchlistContainer.appendChild(fragment);



     }
     

     displayWatchlist()






})