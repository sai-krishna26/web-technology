function register() {
    const username = document.getElementById("newUser").value;
    const password = document.getElementById("newPass").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === username)) {
        alert("User already exists");
        return;
    }

    users.push({
        username,
        password,
        wishlist: [],
        history: []
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered successfully");
    window.location.href = "login.html";
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Invalid credentials");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html";
}