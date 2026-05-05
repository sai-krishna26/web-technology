document.addEventListener("DOMContentLoaded", () => {


 document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            closeTrailer();
        }
    });

const API_KEY = "d5dfe34a324b24ba6f87a0b8bc8646d2";   // 🔁 put your real key here
const BASE_IMG = "https://image.tmdb.org/t/p/w500";

// 🔥 Fetch trending movies
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

        const data = await res.json();

        displayMovies(data.results);

    } catch (error) {
        console.error("❌ Fetch error:", error);
        grid.innerHTML = "<p style='color:red'>Failed to load movies</p>";
    }
}

// 🎬 Display movies
function displayMovies(movies) {
    const grid = document.querySelector(".grid");
    grid.innerHTML = "";

    movies.forEach(movie => {
        if (!movie.poster_path) return;

        const img = document.createElement("img");
        img.src = BASE_IMG + movie.poster_path;
        img.className = "trending";
        img.title = movie.title;

        // 🔥 CLICK → PLAY TRAILER
        img.addEventListener("click", async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
                );

                const data = await res.json();

                const trailer = data.results.find(
                    v => v.type === "Trailer" && v.site === "YouTube"
                );

                if (!trailer) {
                    alert("Trailer not available");
                    return;
                }

                playTrailer(trailer.key);

            } catch (error) {
                console.error("Trailer fetch error:", error);
            }
        });

        grid.appendChild(img);
    });
}

// 🎥 Play trailer
function playTrailer(key) {
    const modal = document.getElementById("trailerModal");
    const frame = document.getElementById("trailerFrame");

    modal.style.display = "block";
    frame.src = `https://www.youtube.com/embed/${key}?autoplay=1`;
}

// ❌ Close trailer
function closeTrailer() {
    const modal = document.getElementById("trailerModal");
    const frame = document.getElementById("trailerFrame");

    modal.style.display = "none";
    frame.src = "";
}

function outsideClick(e) {
    if (e.target.id === "trailerModal") {
        closeTrailer();
    }
}

// 🌍 Make close function global (for HTML onclick)
window.closeTrailer = closeTrailer;

// 🚀 Run
fetchTrending();

});