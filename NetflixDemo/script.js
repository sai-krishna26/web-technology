/**
 * script.js — NETPRIME Main Application
 *
 * Features:
 *  - TMDB API integration
 *  - Smart AI-like recommendations (mood, time, language, behavior)
 *  - Hover trailer previews (Netflix-style)
 *  - Full trailer modal
 *  - Wishlist management
 *  - Watch history + Continue Watching row
 *  - Voice search (Web Speech API)
 *  - Theme toggle (Dark / Light / Cinematic)
 *  - Movie details modal
 *  - User session management
 */

document.addEventListener("DOMContentLoaded", () => {

    // ─── Config ──────────────────────────────────────────────────────────────
    const API_KEY  = "d5dfe34a324b24ba6f87a0b8bc8646d2";
    const BASE_IMG = "https://image.tmdb.org/t/p/w500";
    const BASE_BACKDROP = "https://image.tmdb.org/t/p/w1280";

    // Genre map for display
    const GENRE_MAP = {
        28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
        80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
        14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
        9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
        53: "Thriller", 10752: "War", 37: "Western"
    };

    // Track the currently active hover preview
    let activeHoverData = null;

    // ─── Keyboard Shortcuts ──────────────────────────────────────────────────
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeTrailer();
            closeDetails();
        }
    });

    // ─── Session & UI Setup ──────────────────────────────────────────────────
    function initUI() {
        const user = getCurrentUser();

        if (user && !user.isAdmin) {
            // Show user menu, hide sign-in button
            document.getElementById("userMenu").style.display = "flex";
            document.getElementById("sign-in").style.display = "none";
            document.getElementById("headerUsername").textContent = `👤 ${user.username}`;
        }

        // Restore active mood highlight
        const savedMood = localStorage.getItem("mood");
        if (savedMood) {
            const btn = document.getElementById(`mood-${savedMood}`);
            if (btn) {
                btn.style.background = "var(--accent-color)";
            }
        }

        // Restore language filter
        const savedLang = localStorage.getItem("language");
        if (savedLang) {
            const sel = document.getElementById("langFilter");
            if (sel) sel.value = savedLang;
        }

        // Show active filters
        updateActiveFiltersDisplay();

        // Restore theme
        const savedTheme = localStorage.getItem("theme") || "theme-dark";
        document.body.className = savedTheme;
        updateThemeIcon(savedTheme);
    }

    function updateActiveFiltersDisplay() {
        const mood = localStorage.getItem("mood");
        const lang = localStorage.getItem("language");
        const el = document.getElementById("activeFilters");
        if (!el) return;

        const parts = [];
        if (mood) parts.push(`Mood: ${mood}`);
        if (lang) parts.push(`Language: ${lang}`);

        if (parts.length > 0) {
            el.innerHTML = `
                <span>Active filters: ${parts.join(" · ")}</span>
                <button onclick="clearFilters()" style="
                    margin-left:15px; background:rgba(229,9,20,0.3);
                    border:1px solid #e50914; color:white; padding:4px 12px;
                    border-radius:15px; cursor:pointer; font-size:13px;">
                    ✕ Clear
                </button>
            `;
        } else {
            el.innerHTML = "";
        }
    }

    window.clearFilters = function() {
        localStorage.removeItem("mood");
        localStorage.removeItem("language");
        location.reload();
    };

    // ─── Theme Toggle ────────────────────────────────────────────────────────
    const themes = ["theme-dark", "theme-light", "theme-cinematic"];
    const themeLabels = { "theme-dark": "🌙", "theme-light": "☀️", "theme-cinematic": "🎬" };

    window.cycleTheme = function() {
        const current = document.body.className.split(" ").find(c => themes.includes(c)) || "theme-dark";
        const nextIndex = (themes.indexOf(current) + 1) % themes.length;
        const next = themes[nextIndex];

        document.body.className = next;
        localStorage.setItem("theme", next);
        updateThemeIcon(next);
    };

    function updateThemeIcon(theme) {
        const btn = document.getElementById("themeToggle");
        if (btn) btn.innerHTML = themeLabels[theme] || "🌙";
    }

    // ─── Fetch Trending Movies ───────────────────────────────────────────────
    async function fetchTrending() {
        const grid = document.getElementById("mainGrid");
        if (!grid) return;

        grid.innerHTML = "<p style='color:white; padding:20px;'>Loading movies…</p>";

        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
            );
            const data = await res.json();

            const filtered = smartFilter(data.results);
            const toShow = filtered.length > 0 ? filtered : data.results;

            displayMovies(toShow, "mainGrid");

            // Update section title based on active filters
            const mood = localStorage.getItem("mood");
            const lang = localStorage.getItem("language");
            const titleEl = document.getElementById("buttomText");
            if (titleEl) {
                if (mood === "confused") {
                    titleEl.textContent = "🏆 Top Rated Movies";
                } else if (mood) {
                    titleEl.textContent = `🎯 Recommended for your mood`;
                } else if (lang) {
                    titleEl.textContent = `🌍 Movies in your selected language`;
                } else {
                    titleEl.textContent = "🔥 Trending Now";
                }
            }

        } catch (error) {
            console.error("❌ Fetch error:", error);
            grid.innerHTML = "<p style='color:red; padding:20px;'>Failed to load movies. Check your connection.</p>";
        }
    }

    // ─── Continue Watching ───────────────────────────────────────────────────
    function loadContinueWatching() {
        const user = getCurrentUser();
        if (!user || user.isAdmin) return;

        const history = user.watchHistory || [];
        if (history.length === 0) return;

        const section = document.getElementById("continueWatchingSection");
        const grid = document.getElementById("continueWatchingGrid");
        if (!section || !grid) return;

        section.style.display = "block";

        // Show last 10 watched, most recent first
        const recent = [...history].reverse().slice(0, 10);
        displayMovies(recent, "continueWatchingGrid");

        // Scroll buttons for continue watching
        const cwLeft = document.getElementById("cwLeft");
        const cwRight = document.getElementById("cwRight");
        if (cwLeft) cwLeft.addEventListener("click", () => grid.scrollBy({ left: -400, behavior: "smooth" }));
        if (cwRight) cwRight.addEventListener("click", () => grid.scrollBy({ left: 400, behavior: "smooth" }));
    }

    // ─── Display Movies ──────────────────────────────────────────────────────
    function displayMovies(movies, gridId) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        grid.innerHTML = "";

        movies.forEach(movie => {
            if (!movie.poster_path) return;

            const container = document.createElement("div");
            container.className = "movie-card";

            const img = document.createElement("img");
            img.src = BASE_IMG + movie.poster_path;
            img.className = "trending";
            img.alt = movie.title || "Movie";
            img.title = movie.title;

            // ❤️ Wishlist button
            const wishBtn = document.createElement("button");
            wishBtn.innerHTML = "❤️";
            wishBtn.className = "wishlist-btn";
            wishBtn.title = "Add to Wishlist";
            wishBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                addToWishlist(movie);
            });

            // 🎬 Click → Full trailer + track history
            img.addEventListener("click", async () => {
                stopAllHoverPreviews();
                await playFullTrailer(movie.id);
                trackWatchHistory(movie);
            });

            // 🔥 Hover → Preview trailer (500–800ms delay)
            let hoverTimeout;

            container.addEventListener("mouseenter", () => {
                hoverTimeout = setTimeout(() => {
                    playHoverPreview(movie.id, container, img);
                }, 700);
            });

            container.addEventListener("mouseleave", () => {
                clearTimeout(hoverTimeout);
                stopHoverPreview(container, img);
            });

            container.appendChild(img);
            container.appendChild(wishBtn);
            grid.appendChild(container);
        });
    }

    // ─── Hover Trailer Preview ───────────────────────────────────────────────
    async function playHoverPreview(movieId, container, img) {
        // Only one preview at a time
        stopAllHoverPreviews();

        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
            );
            const data = await res.json();
            const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");

            if (!trailer) return;

            // Fade out poster
            img.style.opacity = "0";
            img.style.transition = "opacity 0.3s";

            // Create muted, no-controls iframe
            const iframe = document.createElement("iframe");
            iframe.className = "hover-trailer";
            iframe.src = [
                `https://www.youtube.com/embed/${trailer.key}`,
                `?autoplay=1&mute=1&controls=0`,
                `&modestbranding=1&rel=0&showinfo=0`,
                `&loop=1&playlist=${trailer.key}`
            ].join("");
            iframe.allow = "autoplay";
            iframe.setAttribute("allowfullscreen", "");
            iframe.style.cssText = `
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                border: none;
                border-radius: 12px;
                z-index: 10;
                pointer-events: none;
            `;

            container.appendChild(iframe);
            activeHoverData = { container, iframe, img };

        } catch (err) {
            console.error("Hover preview error:", err);
        }
    }

    function stopHoverPreview(container, img) {
        const existing = container.querySelector(".hover-trailer");
        if (existing) existing.remove();
        if (img) {
            img.style.opacity = "1";
        }
        if (activeHoverData && activeHoverData.container === container) {
            activeHoverData = null;
        }
    }

    function stopAllHoverPreviews() {
        if (activeHoverData) {
            stopHoverPreview(activeHoverData.container, activeHoverData.img);
        }
    }

    // ─── Full Trailer Modal ──────────────────────────────────────────────────
    async function playFullTrailer(movieId) {
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
            );
            const data = await res.json();
            const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");

            if (!trailer) {
                alert("Trailer not available for this movie.");
                return;
            }

            const modal = document.getElementById("trailerModal");
            const frame = document.getElementById("trailerFrame");
            modal.style.display = "block";
            frame.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;

        } catch (err) {
            console.error("Trailer error:", err);
        }
    }

    function closeTrailer() {
        const modal = document.getElementById("trailerModal");
        const frame = document.getElementById("trailerFrame");
        if (modal) modal.style.display = "none";
        if (frame) frame.src = "";
    }

    function outsideClick(e) {
        if (e.target.id === "trailerModal") closeTrailer();
    }

    // ─── Movie Details Modal ─────────────────────────────────────────────────
    async function showMovieDetails(movieId) {
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
            );
            const movie = await res.json();

            const modal = document.getElementById("detailsModal");
            const content = document.getElementById("detailsContent");

            const backdropUrl = movie.backdrop_path
                ? BASE_BACKDROP + movie.backdrop_path
                : (movie.poster_path ? BASE_IMG + movie.poster_path : "");

            const genres = (movie.genres || [])
                .map(g => `<span class="genre-badge">${g.name}</span>`)
                .join("");

            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
            const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
            const runtime = movie.runtime ? `${movie.runtime} min` : "N/A";

            content.innerHTML = `
                <button onclick="closeDetails()" style="
                    position:absolute; top:15px; right:20px;
                    background:rgba(0,0,0,0.7); border:none; color:white;
                    font-size:30px; cursor:pointer; z-index:10; border-radius:50%;
                    width:45px; height:45px; line-height:1;">
                    &times;
                </button>
                ${backdropUrl ? `<img src="${backdropUrl}" class="details-backdrop" alt="${movie.title}">` : ""}
                <div class="details-info">
                    <h1>${movie.title}</h1>
                    <div class="details-meta">
                        <span>⭐ ${rating}</span>
                        <span>📅 ${year}</span>
                        <span>⏱ ${runtime}</span>
                        <span>🌍 ${(movie.original_language || "").toUpperCase()}</span>
                    </div>
                    <p class="details-overview">${movie.overview || "No description available."}</p>
                    <div class="details-genres">${genres}</div>
                    <div style="margin-top:25px; display:flex; gap:15px; flex-wrap:wrap;">
                        <button onclick="playFullTrailerFromDetails(${movie.id})" style="
                            padding:12px 30px; background:#e50914; border:none;
                            border-radius:5px; color:white; font-size:16px;
                            font-weight:bold; cursor:pointer;">
                            ▶ Play Trailer
                        </button>
                        <button onclick="addToWishlistById(${movie.id})" style="
                            padding:12px 30px; background:rgba(255,255,255,0.1);
                            border:1px solid white; border-radius:5px; color:white;
                            font-size:16px; cursor:pointer;">
                            ❤️ Add to Wishlist
                        </button>
                    </div>
                </div>
            `;

            modal.style.display = "block";

        } catch (err) {
            console.error("Details error:", err);
        }
    }

    function closeDetails() {
        const modal = document.getElementById("detailsModal");
        if (modal) modal.style.display = "none";
    }

    function closeDetailsOutside(e) {
        if (e.target.id === "detailsModal") closeDetails();
    }

    // Exposed for details modal buttons
    window.playFullTrailerFromDetails = async function(movieId) {
        closeDetails();
        await playFullTrailer(movieId);
    };

    window.addToWishlistById = async function(movieId) {
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
            );
            const movie = await res.json();
            addToWishlist(movie);
        } catch (err) {
            console.error("Wishlist error:", err);
        }
    };

    // ─── Wishlist Management ─────────────────────────────────────────────────
    function addToWishlist(movie) {
        const user = getCurrentUser();
        if (!user || user.isAdmin) {
            if (confirm("Please login to add to wishlist. Go to login page?")) {
                window.location.href = "login.html";
            }
            return;
        }

        if (!user.wishlist) user.wishlist = [];

        if (user.wishlist.find(m => m.id === movie.id)) {
            alert(`"${movie.title}" is already in your wishlist ❤️`);
            return;
        }

        user.wishlist.push({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            genre_ids: movie.genre_ids || [],
            overview: movie.overview
        });

        saveUser(user);
        alert(`"${movie.title}" added to wishlist ❤️`);
    }

    // ─── Watch History Tracking ──────────────────────────────────────────────
    function trackWatchHistory(movie) {
        const user = getCurrentUser();
        if (!user || user.isAdmin) return;

        if (!user.watchHistory) user.watchHistory = [];
        if (!user.watchedGenres) user.watchedGenres = {};

        // Update or add to history
        const existingIdx = user.watchHistory.findIndex(m => m.id === movie.id);
        const entry = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            genre_ids: movie.genre_ids || [],
            watchedAt: new Date().toISOString()
        };

        if (existingIdx >= 0) {
            user.watchHistory[existingIdx] = entry;  // Update timestamp
        } else {
            user.watchHistory.push(entry);
        }

        // Track genre preferences for behavior-based recommendations
        (movie.genre_ids || []).forEach(genreId => {
            user.watchedGenres[genreId] = (user.watchedGenres[genreId] || 0) + 1;
        });

        saveUser(user);
    }

    // ─── Smart Recommendation Engine ─────────────────────────────────────────
    function smartFilter(movies) {
        const mood = localStorage.getItem("mood");
        const lang = localStorage.getItem("language");
        const hour = new Date().getHours();
        const user = getCurrentUser();

        let result = [...movies];
        let preferredGenres = [];

        // 🕒 Time-based recommendations
        if (hour >= 6 && hour < 12) {
            preferredGenres.push(35);       // Morning → Comedy
        } else if (hour >= 12 && hour < 18) {
            preferredGenres.push(18);       // Afternoon → Drama
        } else if (hour >= 18 && hour < 22) {
            preferredGenres.push(28);       // Evening → Action
        } else {
            preferredGenres.push(53);       // Night → Thriller
        }

        // 😊 Mood-based recommendations
        const moodGenres = {
            happy:   [35, 12],   // Comedy, Adventure
            sad:     [18, 10749], // Drama, Romance
            excited: [28, 878],  // Action, Sci-Fi
            confused: null       // Handled separately
        };

        if (mood === "confused") {
            // Confused → Top-rated only
            return movies
                .filter(m => m.vote_average >= 7)
                .sort((a, b) => b.vote_average - a.vote_average);
        }

        if (mood && moodGenres[mood]) {
            preferredGenres.push(...moodGenres[mood]);
        }

        // 🧠 Behavior-based (from watch history)
        if (user && user.watchedGenres && Object.keys(user.watchedGenres).length > 0) {
            const topGenres = Object.entries(user.watchedGenres)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([id]) => parseInt(id));

            preferredGenres.push(...topGenres);
        }

        // 🌍 Language filter (soft — fallback to all if no results)
        if (lang) {
            const langMovies = result.filter(m => m.original_language === lang);
            if (langMovies.length >= 3) {
                result = langMovies;
            }
            // else: fallback to all movies
        }

        // 🔥 Sort by genre match score (more matches = higher rank)
        result.sort((a, b) => {
            const aScore = preferredGenres.filter(g => (a.genre_ids || []).includes(g)).length;
            const bScore = preferredGenres.filter(g => (b.genre_ids || []).includes(g)).length;
            return bScore - aScore;
        });

        return result;
    }

    // ─── Mood & Language Setters ─────────────────────────────────────────────
    window.setMood = function(mood) {
        localStorage.setItem("mood", mood);
        location.reload();
    };

    window.setLanguage = function(lang) {
        if (lang) {
            localStorage.setItem("language", lang);
        } else {
            localStorage.removeItem("language");
        }
        location.reload();
    };

    // ─── Voice Search ────────────────────────────────────────────────────────
    window.startVoiceSearch = function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice search is not supported in this browser. Try Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Visual feedback
        const voiceBtn = document.querySelector(".voice-btn");
        if (voiceBtn) {
            voiceBtn.innerHTML = "🔴 Listening…";
            voiceBtn.style.background = "linear-gradient(135deg, #e50914, #b00710)";
        }

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            console.log("🎤 Heard:", transcript);

            // Reset button
            if (voiceBtn) {
                voiceBtn.innerHTML = `<i class="fas fa-microphone"></i> Voice Search`;
                voiceBtn.style.background = "";
            }

            // Parse commands
            const commands = [
                { keywords: ["comedy", "funny", "happy"],   action: () => setMood("happy") },
                { keywords: ["sad", "drama", "emotional"],  action: () => setMood("sad") },
                { keywords: ["action", "excited", "thrill"], action: () => setMood("excited") },
                { keywords: ["confused", "top rated", "best"], action: () => setMood("confused") },
                { keywords: ["hindi", "bollywood"],         action: () => setLanguage("hi") },
                { keywords: ["english"],                    action: () => setLanguage("en") },
                { keywords: ["korean", "k-drama"],          action: () => setLanguage("ko") },
                { keywords: ["japanese", "anime"],          action: () => setLanguage("ja") },
                { keywords: ["french"],                     action: () => setLanguage("fr") },
                { keywords: ["spanish"],                    action: () => setLanguage("es") },
                { keywords: ["clear", "reset", "all"],      action: () => clearFilters() },
            ];

            let matched = false;
            for (const cmd of commands) {
                if (cmd.keywords.some(kw => transcript.includes(kw))) {
                    cmd.action();
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                alert(`Heard: "${transcript}"\n\nTry: "Show comedy movies", "Show Hindi movies", "Show action movies"`);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech error:", event.error);
            if (voiceBtn) {
                voiceBtn.innerHTML = `<i class="fas fa-microphone"></i> Voice Search`;
                voiceBtn.style.background = "";
            }
            if (event.error !== "no-speech") {
                alert("Voice search error: " + event.error);
            }
        };

        recognition.onend = () => {
            if (voiceBtn) {
                voiceBtn.innerHTML = `<i class="fas fa-microphone"></i> Voice Search`;
                voiceBtn.style.background = "";
            }
        };

        recognition.start();
    };

    // ─── Scroll Buttons ──────────────────────────────────────────────────────
    const mainLeft  = document.getElementById("mainLeft");
    const mainRight = document.getElementById("mainRight");
    const mainGrid  = document.getElementById("mainGrid");

    if (mainLeft && mainRight && mainGrid) {
        mainLeft.addEventListener("click",  () => mainGrid.scrollBy({ left: -400, behavior: "smooth" }));
        mainRight.addEventListener("click", () => mainGrid.scrollBy({ left:  400, behavior: "smooth" }));
    }

    // ─── Expose Globals ──────────────────────────────────────────────────────
    window.closeTrailer       = closeTrailer;
    window.outsideClick       = outsideClick;
    window.closeDetails       = closeDetails;
    window.closeDetailsOutside = closeDetailsOutside;
    window.showMovieDetails   = showMovieDetails;

    // ─── Initialize ──────────────────────────────────────────────────────────
    initUI();
    fetchTrending();
    loadContinueWatching();

});
