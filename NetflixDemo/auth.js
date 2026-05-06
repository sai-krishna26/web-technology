/**
 * auth.js — Authentication module for NETPRIME
 * Handles login, registration, session management via localStorage
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = "block";
    setTimeout(() => (el.style.display = "none"), 4000);
}

function showSuccess(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = "block";
}

// ─── Registration ────────────────────────────────────────────────────────────

function register(e) {
    if (e) e.preventDefault();

    const username    = document.getElementById("newUser").value.trim();
    const email       = document.getElementById("email").value.trim();
    const password    = document.getElementById("newPass").value;
    const confirmPass = document.getElementById("confirmPass").value;

    // Validation
    if (!username || !email || !password) {
        showError("errorMessage", "All fields are required.");
        return;
    }

    if (password !== confirmPass) {
        showError("errorMessage", "Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        showError("errorMessage", "Password must be at least 6 characters.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === username)) {
        showError("errorMessage", "Username already taken. Choose another.");
        return;
    }

    if (users.find(u => u.email === email)) {
        showError("errorMessage", "Email already registered.");
        return;
    }

    // Create new user object
    const newUser = {
        username,
        email,
        password,
        wishlist: [],
        watchHistory: [],
        watchedGenres: {},   // genre_id → count (for behavior-based recommendations)
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showSuccess("successMessage", "Account created! Redirecting to login…");
    setTimeout(() => (window.location.href = "login.html"), 1500);
}

// ─── Login ───────────────────────────────────────────────────────────────────

function login(e) {
    if (e) e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Admin shortcut
    if (username === "admin" && password === "admin123") {
        localStorage.setItem("currentUser", JSON.stringify({ username: "admin", isAdmin: true }));
        window.location.href = "admin.html";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        showError("errorMessage", "Invalid username or password.");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html";
}

// ─── Logout ──────────────────────────────────────────────────────────────────

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// ─── Session helpers (used across pages) ─────────────────────────────────────

/**
 * Returns the current logged-in user or null.
 */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
}

/**
 * Persists updated user data back to both currentUser and users array.
 */
function saveUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const updated = users.map(u => (u.username === user.username ? user : u));
    localStorage.setItem("users", JSON.stringify(updated));
}

// Expose globals
window.register  = register;
window.login     = login;
window.logout    = logout;
window.getCurrentUser = getCurrentUser;
window.saveUser  = saveUser;
