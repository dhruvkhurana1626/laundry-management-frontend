const profileForm =
    document.getElementById("profileForm");

const profileMessage =
    document.getElementById("profileMessage");

const saveButton =
    document.getElementById("saveButton");

const logoutButton =
    document.getElementById("logoutButton");


const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const businessNameInput =
    document.getElementById("businessName");

const ownerNameInput =
    document.getElementById("ownerName");

const phoneInput =
    document.getElementById("phone");

const addressInput =
    document.getElementById("address");

const cityInput =
    document.getElementById("city");

const aboutBusinessInput =
    document.getElementById("aboutBusiness");

const panNumberInput =
    document.getElementById("panNumber");

const gstNumberInput =
    document.getElementById("gstNumber");


// =========================
// Load Profile
// =========================

async function loadProfile() {

    try {

        const response = await apiRequest(
            `${API_BASE_URL}/api/v1/profile`,
            {
                method: "GET"
            }
        );

        if (!response) {
            return;
        }

        if (!response.ok) {

            profileMessage.textContent =
                "Unable to load profile.";

            return;
        }

        const data =
            await response.json();

        console.log("Profile:", data);

        nameInput.value =
            data.name || "";

        emailInput.value =
            data.email || "";

        businessNameInput.value =
            data.businessName || "";

        ownerNameInput.value =
            data.ownerName || "";

        phoneInput.value =
            data.phone || "";

        addressInput.value =
            data.address || "";

        cityInput.value =
            data.city || "";

        aboutBusinessInput.value =
            data.aboutBusiness || "";

        panNumberInput.value =
            data.panNumber || "";

        gstNumberInput.value =
            data.gstNumber || "";

    } catch (error) {

        console.error(
            "Load profile error:",
            error
        );

        profileMessage.textContent =
            "Unable to connect to the server.";
    }
}


// =========================
// Update Profile
// =========================

profileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        saveButton.disabled = true;

        saveButton.textContent =
            "Saving...";

        profileMessage.textContent =
            "Saving changes...";


        const profileData = {};

        const addIfNotEmpty = (key, input) => {

            const value =
                input.value.trim();

            if (value !== "") {
                profileData[key] = value;
            }
        };


        addIfNotEmpty(
            "businessName",
            businessNameInput
        );

        addIfNotEmpty(
            "ownerName",
            ownerNameInput
        );

        addIfNotEmpty(
            "phone",
            phoneInput
        );

        addIfNotEmpty(
            "address",
            addressInput
        );

        addIfNotEmpty(
            "city",
            cityInput
        );

        addIfNotEmpty(
            "aboutBusiness",
            aboutBusinessInput
        );

        addIfNotEmpty(
            "panNumber",
            panNumberInput
        );

        addIfNotEmpty(
            "gstNumber",
            gstNumberInput
        );


        console.log(
            "PATCH profile payload:",
            profileData
        );


        try {

            const response = await apiRequest(
                `${API_BASE_URL}/api/v1/profile`,
                {
                    method: "PATCH",

                    body:
                        JSON.stringify(profileData)
                }
            );


            if (!response) {
                return;
            }


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
                    "Response is not JSON:",
                    responseText
                );
            }


            if (response.ok) {

                profileMessage.textContent =
                    "Profile updated successfully.";

                console.log(
                    "Updated profile:",
                    data
                );

            } else {

                console.error(
                    "Profile update failed:",
                    response.status,
                    responseText
                );

                profileMessage.textContent =
                    data.message ||
                    data.error ||
                    responseText ||
                    "Unable to update profile.";
            }


        } catch (error) {

            console.error(
                "Update profile error:",
                error
            );

            profileMessage.textContent =
                "Unable to connect to the server.";

        } finally {

            saveButton.disabled = false;

            saveButton.textContent =
                "Save Changes";
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


// =========================
// Initial Load
// =========================

loadProfile();