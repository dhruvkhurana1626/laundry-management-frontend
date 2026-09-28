const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const loginButton =
    loginForm.querySelector(".login-button");


// ================================
// PASSWORD VISIBILITY TOGGLE
// ================================

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.textContent = "🙈";

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type = "password";

                togglePassword.textContent = "👁";

                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }

        }
    );
}


// ================================
// LOGIN
// ================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            passwordInput.value;


        loginMessage.textContent =
            "Logging in...";


        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/v1/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            /*
             * =========================
             * TOO MANY REQUESTS
             * =========================
             */

            if (response.status === 429) {

                let message =
                    "Too many login attempts. Please try again later.";


                try {

                    const data =
                        await response.json();

                    message =
                        data.message ||
                        data.error ||
                        message;

                } catch (error) {

                    // Backend returned non-JSON response.
                }


                loginMessage.textContent =
                    message;

                return;
            }


            /*
             * =========================
             * READ RESPONSE
             * =========================
             */

            const responseText =
                await response.text();


            let data = {};

            try {

                data =
                    responseText
                        ? JSON.parse(responseText)
                        : {};

            } catch (error) {

                console.error(
                    "Login response is not JSON:",
                    responseText
                );
            }


            /*
             * =========================
             * SUCCESS
             * =========================
             */

            if (response.ok) {

                sessionStorage.setItem(
                    "accessToken",
                    data.accessToken
                );

                sessionStorage.setItem(
                    "refreshToken",
                    data.refreshToken
                );


                window.location.href =
                    "dashboard.html";


                return;
            }


            /*
             * =========================
             * OTHER ERRORS
             * =========================
             */

            loginMessage.textContent =
                data.message ||
                data.error ||
                responseText ||
                "Invalid email or password.";

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            loginMessage.textContent =
                "Unable to connect to the server.";

        } finally {

            loginButton.disabled =
                false;

            loginButton.textContent =
                "Login";
        }

    }
);