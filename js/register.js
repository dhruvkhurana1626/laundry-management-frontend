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

// ================================
// PASSWORD TOGGLES
// ================================

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


function setupPasswordToggle(input, button) {

    if (!input || !button) {
        return;
    }

    button.addEventListener("click", function () {

        if (input.type === "password") {

            input.type = "text";

            button.textContent = "🙈";

            button.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            input.type = "password";

            button.textContent = "👁";

            button.setAttribute(
                "aria-label",
                "Show password"
            );
        }
    });
}


setupPasswordToggle(
    passwordInput,
    togglePassword
);

setupPasswordToggle(
    confirmPasswordInput,
    toggleConfirmPassword
);


passwordInput.addEventListener("input", checkPasswords);

confirmPasswordInput.addEventListener("input", checkPasswords);


registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        passwordInput.value;

    registerMessage.textContent =
        "Creating account...";

    registerButton.disabled = true;
    registerButton.textContent = "Creating...";

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

        const responseText =
            await response.text();

        let data = {};

        try {

            data = responseText
                ? JSON.parse(responseText)
                : {};

        } catch (error) {

            console.error(
                "Register response is not JSON:",
                responseText
            );
        }

        if (response.ok) {

            registerMessage.textContent =
                data.message ||
                responseText ||
                "Account created successfully.";

            registerForm.reset();

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1500);

            return;
        }

        registerMessage.textContent =
            data.message ||
            data.error ||
            responseText ||
            "Unable to create account.";

    } catch (error) {

        console.error(
            "Register error:",
            error
        );

        registerMessage.textContent =
            "Unable to connect to the server.";

    } finally {

        registerButton.disabled = false;
        registerButton.textContent = "Create Account";
    }
});