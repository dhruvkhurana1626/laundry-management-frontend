const resetPasswordForm =
    document.getElementById("resetPasswordForm");

const resetMessage =
    document.getElementById("resetMessage");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const resetButton =
    document.querySelector(".reset-button");


// Get token from URL
const urlParams = new URLSearchParams(window.location.search);

const token = urlParams.get("token");


// Check whether token exists
if (!token) {

    resetMessage.textContent =
        "Invalid or missing password reset link.";

    resetButton.disabled = true;
}


// Check passwords while typing
function checkPasswords() {

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword === "") {

        confirmPasswordInput.style.borderColor = "";

        resetButton.disabled = false;

        resetMessage.textContent = "";

        return;
    }

    if (password !== confirmPassword) {

        confirmPasswordInput.style.borderColor = "#ef4444";

        resetMessage.textContent =
            "Passwords do not match.";

        resetButton.disabled = true;

    } else {

        confirmPasswordInput.style.borderColor = "#22c55e";

        resetMessage.textContent = "";

        resetButton.disabled = false;
    }
}


passwordInput.addEventListener(
    "input",
    checkPasswords
);

confirmPasswordInput.addEventListener(
    "input",
    checkPasswords
);


// Submit reset password
resetPasswordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const password = passwordInput.value;

        resetMessage.textContent =
            "Resetting password...";

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/v1/auth/reset-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        token: token,
                        newPassword: password
                    })
                }
            );

            const data = await response.text();

            if (response.ok) {

                resetMessage.textContent =
                    data;

                resetPasswordForm.reset();

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1500);

            } else {

                resetMessage.textContent =
                    data || "Unable to reset password.";
            }

        } catch (error) {

            console.error(error);

            resetMessage.textContent =
                "Unable to connect to the server.";
        }
    }
);