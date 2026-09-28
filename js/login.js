const API_BASE_URL = "http://13.205.57.206:8080";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Logging in...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            sessionStorage.setItem(
                "accessToken",
                data.accessToken
            );

            sessionStorage.setItem(
                "refreshToken",
                data.refreshToken
            );

            window.location.href = "dashboard.html";

        } else {

            loginMessage.textContent =
                data.message || "Invalid email or password.";
        }

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Unable to connect to the server.";
    }
});