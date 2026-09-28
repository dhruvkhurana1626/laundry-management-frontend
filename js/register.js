const API_BASE_URL = "http://13.205.57.206:8080";

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const registerButton = document.querySelector(".register-button");


function checkPasswords() {

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Nothing entered yet
    if (confirmPassword === "") {

        confirmPasswordInput.style.borderColor = "";

        registerButton.disabled = false;

        return;
    }

    // Passwords don't match
    if (password !== confirmPassword) {

        confirmPasswordInput.style.borderColor = "#ef4444";

        registerMessage.textContent = "Passwords do not match.";

        registerButton.disabled = true;

    } else {

        // Passwords match
        confirmPasswordInput.style.borderColor = "#22c55e";

        registerMessage.textContent = "";

        registerButton.disabled = false;
    }
}


passwordInput.addEventListener("input", checkPasswords);

confirmPasswordInput.addEventListener("input", checkPasswords);


registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    registerMessage.textContent = "Creating account...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.text();

        if (response.ok) {

            registerMessage.textContent = data ;

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } else {

            registerMessage.textContent =
                data.message || "Unable to create account.";
        }

    } catch (error) {

        console.error(error);

        registerMessage.textContent =
            "Unable to connect to the server.";
    }
});