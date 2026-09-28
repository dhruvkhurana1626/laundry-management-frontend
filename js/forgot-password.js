const API_BASE_URL = "http://13.205.57.206:8080";

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

const forgotMessage =
    document.getElementById("forgotMessage");

forgotPasswordForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    forgotMessage.textContent = "Sending reset link...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/forgot-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email
                })
            }
        );

        const data = await response.text();

        if (response.ok) {

            forgotMessage.textContent = data;

            forgotPasswordForm.reset();

        } else {

            forgotMessage.textContent =
                data || "Unable to send reset link.";
        }

    } catch (error) {

        console.error(error);

        forgotMessage.textContent =
            "Unable to connect to the server.";
    }
});w