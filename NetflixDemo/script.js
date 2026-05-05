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

        const filteredMovies = smartFilter(data.results);
        
        console.log("Original:", data.results.length);
        console.log("Filtered:", filteredMovies.length);

        
        if (filteredMovies.length === 0) {
            displayMovies(data.results);   // fallback
            } else {
            displayMovies(filteredMovies);
            }

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

        const container = document.createElement("div");
        container.style.position = "relative";

        const img = document.createElement("img");
        img.src = BASE_IMG + movie.poster_path;
        img.className = "trending";
        img.title = movie.title;

        // ❤️ Wishlist button
        const btn = document.createElement("button");
        btn.innerText = "❤️";
        btn.className = "wishlist-btn";

        btn.onclick = (e) => {
            e.stopPropagation();   // 🔥 IMPORTANT
            addToWishlist(movie);
        };

        // 🎬 Trailer click (CORRECT WAY)
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

        // ✅ CORRECT STRUCTURE
        container.appendChild(img);
        container.appendChild(btn);

        grid.appendChild(container);
    });
}

function addToWishlist(movie) {

    let user = JSON.parse(localStorage.getItem("currentUser"));
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!user) {
        alert("Please login first");
        return;
    }

    // ensure wishlist exists
    if (!user.wishlist) user.wishlist = [];

    // prevent duplicates
    if (user.wishlist.find(m => m.id === movie.id)) {
        alert("Already in wishlist");
        return;
    }

    // add movie
    user.wishlist.push(movie);

    // update currentUser
    localStorage.setItem("currentUser", JSON.stringify(user));

    // 🔥 IMPORTANT: update user in users array
    const updatedUsers = users.map(u => {
        if (u.username === user.username) {
            return user;
        }
        return u;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Added to wishlist ❤️");
}


function smartFilter(movies) {
    let mood = localStorage.getItem("mood");
    let lang = localStorage.getItem("language");
    let hour = new Date().getHours();

    let result = [...movies];

    let preferredGenres = [];

    // 🕒 Time-based preference
    if (hour < 12) preferredGenres.push(35);     // comedy
    else if (hour < 18) preferredGenres.push(18); // drama
    else preferredGenres.push(28);               // action

    // 😊 Mood-based preference
    if (mood === "happy") preferredGenres.push(35);
    if (mood === "sad") preferredGenres.push(18);

    // 🤯 Confused → show top-rated
    if (mood === "confused") {
        return movies.sort((a, b) => b.vote_average - a.vote_average);
    }

    // 🌍 Language filter (soft filter)
    if (lang) {
        const langMovies = result.filter(m => m.original_language === lang);
        if (langMovies.length > 0) {
            result = langMovies;
        }
    }

    // 🔥 SORT instead of FILTER (KEY FIX)
    result.sort((a, b) => {
        const aMatch = preferredGenres.some(g => a.genre_ids.includes(g)) ? 1 : 0;
        const bMatch = preferredGenres.some(g => b.genre_ids.includes(g)) ? 1 : 0;
        return bMatch - aMatch;
    });

    return result;
}

window.setMood = function(mood) {
    localStorage.setItem("mood", mood);
    location.reload();
}

window.setLanguage=function(lang) {
    localStorage.setItem("language", lang);
    location.reload();
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