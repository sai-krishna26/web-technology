/**
 * app.js — Route guard for protected pages
 * Include this on pages that require authentication.
 */

(function() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        window.location.href = "login.html";
    }
})();
