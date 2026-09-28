const changePasswordForm =
    document.getElementById("changePasswordForm");

const changePasswordButton =
    document.getElementById("changePasswordButton");

const passwordMessage =
    document.getElementById("passwordMessage");

const logoutButton =
    document.getElementById("logoutButton");


const currentPasswordInput =
    document.getElementById("currentPassword");

const newPasswordInput =
    document.getElementById("newPassword");

const confirmNewPasswordInput =
    document.getElementById("confirmNewPassword");


// =========================
// Password Toggle
// =========================

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
    currentPasswordInput,
    document.getElementById("toggleCurrentPassword")
);

setupPasswordToggle(
    newPasswordInput,
    document.getElementById("toggleNewPassword")
);

setupPasswordToggle(
    confirmNewPasswordInput,
    document.getElementById("toggleConfirmPassword")
);


// =========================
// Change Password
// =========================

changePasswordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const currentPassword =
            currentPasswordInput.value.trim();

        const newPassword =
            newPasswordInput.value.trim();

        const confirmNewPassword =
            confirmNewPasswordInput.value.trim();


        passwordMessage.textContent = "";


        if (
            !currentPassword ||
            !newPassword ||
            !confirmNewPassword
        ) {

            passwordMessage.textContent =
                "Please fill all password fields.";

            return;
        }


        if (
            newPassword !==
            confirmNewPassword
        ) {

            passwordMessage.textContent =
                "New passwords do not match.";

            return;
        }


        if (
            currentPassword ===
            newPassword
        ) {

            passwordMessage.textContent =
                "New password must be different from current password.";

            return;
        }


        changePasswordButton.disabled = true;

        changePasswordButton.textContent =
            "Changing...";

        passwordMessage.textContent =
            "Changing password.";


        try {

            const response = await apiRequest(
                `${API_BASE_URL}/api/v1/auth/change-password`,
                {
                    method: "PUT",

                    body: JSON.stringify({

                        currentPassword:
                            currentPassword,

                        newPassword:
                            newPassword,

                        confirmationPassword:
                            confirmNewPassword

                    })
                }
            );


            if (!response) {
                return;
            }


            const responseText =
                await response.text();


            let message =
                responseText;


            try {

                const data =
                    responseText
                        ? JSON.parse(responseText)
                        : {};

                message =
                    data.message ||
                    data.error ||
                    responseText;

            } catch (error) {

                // Backend returned plain text.
            }


            if (response.ok) {

                passwordMessage.textContent =
                    message ||
                    "Password changed successfully.";

                sessionStorage.removeItem(
                    "accessToken"
                );

                sessionStorage.removeItem(
                    "refreshToken"
                );


                setTimeout(function () {

                    window.location.href =
                        "login.html";

                }, 1000);


                return;
            }


            passwordMessage.textContent =
                message ||
                "Unable to change password.";


        } catch (error) {

            console.error(
                "Change password error:",
                error
            );

            passwordMessage.textContent =
                "Unable to connect to the server.";

        } finally {

            /*
             * If successful, we're redirecting to login.
             * Otherwise restore the button.
             */

            if (
                passwordMessage.textContent !==
                "Password changed successfully."
            ) {

                changePasswordButton.disabled =
                    false;

                changePasswordButton.textContent =
                    "Change Password";
            }
        }

    }
);


// =========================
// Logout
// =========================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            logoutUser();

        }
    );
}