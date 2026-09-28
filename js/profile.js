const API_BASE_URL = "http://13.205.57.206:8080";

const profileForm = document.getElementById("profileForm");

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


// Load profile

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

        const data = await response.json();

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

        console.error(error);

        profileMessage.textContent =
            "Unable to connect to the server.";
    }
}


// Update profile

profileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        saveButton.disabled = true;

        profileMessage.textContent =
            "Saving changes...";


        const profileData = {

            businessName:
                businessNameInput.value.trim(),

            ownerName:
                ownerNameInput.value.trim(),

            phone:
                phoneInput.value.trim(),

            address:
                addressInput.value.trim(),

            city:
                cityInput.value.trim(),

            aboutBusiness:
                aboutBusinessInput.value.trim(),

            panNumber:
                panNumberInput.value.trim(),

            gstNumber:
                gstNumberInput.value.trim()
        };


        try {

            const response = await apiRequest(
                `${API_BASE_URL}/api/v1/profile`,
                {
                    method: "PATCH",

                    body: JSON.stringify(profileData)
                }
            );


            if (!response) {
                return;
            }


            const data = await response.json();


            if (response.ok) {

                profileMessage.textContent =
                    "Profile updated successfully.";

                console.log(
                    "Updated profile:",
                    data
                );

            } else {

                profileMessage.textContent =
                    data.message ||
                    "Unable to update profile.";
            }


        } catch (error) {

            console.error(error);

            profileMessage.textContent =
                "Unable to connect to the server.";

        } finally {

            saveButton.disabled = false;
        }

    }
);


// Logout

logoutButton.addEventListener(
    "click",
    function () {

        logoutUser();

    }
);


// Load profile when page opens

loadProfile();