document.addEventListener("DOMContentLoaded", () => {

const API_KEY = "d5dfe34a324b24ba6f87a0b8bc8646d2";  // 🔁 Replace with your real key
const BASE_IMG = "https://image.tmdb.org/t/p/w500";

// Fetch trending movies
async function fetchTrending() {
    const grid = document.querySelector(".grid");

    if (!grid) {
        console.error("❌ .grid not found");
        return;
    }

    grid.innerHTML = "<p style='color:white'>Loading...</p>";

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        console.log("API DATA:", data); // 🔍 Debug

        if (!data.results) {
            throw new Error("Invalid API response");
        }

        displayMovies(data.results);

    } catch (error) {
        console.error("❌ Fetch error:", error);
        grid.innerHTML = "<p style='color:red'>Failed to load movies</p>";
    }
}

// Display movies
function displayMovies(movies) {
    const grid = document.querySelector(".grid");
    grid.innerHTML = "";

    movies.forEach(movie => {
        if (!movie.poster_path) return;

        const img = document.createElement("img");
        img.src = BASE_IMG + movie.poster_path;
        img.className = "trending";
        img.title = movie.title;

        img.addEventListener("click", () => {
           img.addEventListener("click", () => {
    const popup = document.createElement("div");
    popup.className = "movie-popup";

    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-btn">&times;</span>
            <img src="${BASE_IMG + movie.poster_path}" class="popup-img">
            <h2>${movie.title}</h2>
            <p>⭐ ${movie.vote_average}</p>
            <p style="font-size:14px; margin-top:10px;">
                ${movie.overview || "No description available"}
            </p>
        </div>
    `;

    document.body.appendChild(popup);

    // Close popup
    popup.querySelector(".close-btn").onclick = () => popup.remove();

    // Click outside to close
    popup.addEventListener("click", (e) => {
        if (e.target === popup) popup.remove();
    });
});
        });

        grid.appendChild(img);
    });
}

// Run
fetchTrending();

});

