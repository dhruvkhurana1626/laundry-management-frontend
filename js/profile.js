const profileForm =
    document.getElementById("profileForm");

const profileMessage =
    document.getElementById("profileMessage");

const profilePhotoMessage =
    document.getElementById("profilePhotoMessage");    

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
// Profile Image Elements
// =========================

const profileImage =
    document.getElementById("profileImage");

const profileImageInput =
    document.getElementById("profileImageInput");

const changeProfileImageButton =
    document.getElementById("changeProfileImageButton");

const saveProfileImageButton =
    document.getElementById("saveProfileImageButton");

const cancelProfileImageButton =
    document.getElementById("cancelProfileImageButton");

const viewProfileImageButton =
    document.getElementById("viewProfileImageButton");

const profileImageModal =
    document.getElementById("profileImageModal");

const fullProfileImage =
    document.getElementById("fullProfileImage");

const closeProfileImageModal =
    document.getElementById("closeProfileImageModal");

const removeProfileImageButton =
    document.getElementById("removeProfileImageButton");


// =========================
// Profile Image
// =========================

let selectedProfileImage = null;
let previousProfileImageUrl = "";
let profileImagePreviewUrl = null;

const DEFAULT_PROFILE_IMAGE = "/images/default-profile.svg";

changeProfileImageButton.addEventListener(
    "click",
    function () {
        profileImageInput.click();
    }
);


profileImageInput.addEventListener(
    "change",
    function () {

        const file =
    profileImageInput.files[0];

        if (!file) {
            return;
        }


        // =========================
        // Validate file size first
        // =========================

        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {

            selectedProfileImage = null;
            profileImageInput.value = "";

            profilePhotoMessage.textContent =
                "Image is too large. Please select an image under 5 MB.";

            profileImageError.style.display =
                "block";

            return;
        }


        // =========================
        // Validate file type
        // =========================

        if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png"
        ) {

            selectedProfileImage = null;

            profileImageInput.value = "";

            profilePhotoMessage.textContent =
                "Only JPG and PNG images are allowed.";

            return;
        }


        // Valid image selected
        // Clear previous error

        profileImageError.textContent = "";
        profileImageError.style.display = "none";

        selectedProfileImage = file;

        // Create a temporary preview URL

        if (profileImagePreviewUrl) {
            URL.revokeObjectURL(profileImagePreviewUrl);
        }

        profileImagePreviewUrl =
            URL.createObjectURL(file);

        profileImage.src =
            profileImagePreviewUrl;


        // Show buttons

        saveProfileImageButton.style.display =
            "inline-block";

        cancelProfileImageButton.style.display =
            "inline-block";


        profilePhotoMessage.textContent =
            "Preview ready. Click Save Photo to upload.";

    }
);


// =========================
// Cancel Profile Image
// =========================

cancelProfileImageButton.addEventListener(
    "click",
    function () {

        // Restore the last saved image
        profileImage.src =
            previousProfileImageUrl || DEFAULT_PROFILE_IMAGE;

        selectedProfileImage = null;
        profileImageInput.value = "";

        if (profileImagePreviewUrl) {
            URL.revokeObjectURL(profileImagePreviewUrl);
            profileImagePreviewUrl = null;
        }

        saveProfileImageButton.style.display =
            "none";

        cancelProfileImageButton.style.display =
            "none";

        profileMessage.textContent =
            "Profile photo changes cancelled.";
    }
);


// =========================
// View Profile Image
// =========================

viewProfileImageButton.addEventListener(
    "click",
    function () {

        if (!profileImage.src) {
            return;
        }

        fullProfileImage.src =
            profileImage.src;

        profileImageModal.classList.add("show");
    }
);


// Close modal

closeProfileImageModal.addEventListener(
    "click",
    function () {

        profileImageModal.classList.remove("show");

    }
);


// Close when clicking outside image

profileImageModal.addEventListener(
    "click",
    function (event) {

        if (event.target === profileImageModal) {

            profileImageModal.classList.remove("show");

        }

    }
);

// =========================
// Save Profile Image
// =========================

saveProfileImageButton.addEventListener(
    "click",
    async function () {

        if (!selectedProfileImage) {
            return;
        }


        saveProfileImageButton.disabled =
            true;

        saveProfileImageButton.textContent =
            "Uploading...";

        profileMessage.textContent =
            "Uploading profile photo...";


        const formData =
            new FormData();

        formData.append(
            "file",
            selectedProfileImage
        );


        try {

            const response =
                await apiRequest(
                    `${API_BASE_URL}/api/v1/profile/image`,
                    {
                        method: "PUT",
                        body: formData
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

                // Use the actual S3 URL
                // returned by the backend

                if (data.profileImageUrl) {

                    profileImage.src =
                        data.profileImageUrl;

                    previousProfileImageUrl =
                        data.profileImageUrl;

                    viewProfileImageButton.style.display =
                        "inline-block";

                    removeProfileImageButton.style.display =
                        "inline-block";
                }


                if (profileImagePreviewUrl) {
                    URL.revokeObjectURL(profileImagePreviewUrl);
                    profileImagePreviewUrl = null;
                }

                selectedProfileImage = null;

                profileImageInput.value = "";


                saveProfileImageButton.style.display =
                    "none";

                cancelProfileImageButton.style.display =
                    "none";


                // Clear preview message after successful upload
                profilePhotoMessage.textContent = "";

            } else {

                console.error(
                    "Profile image upload failed:",
                    response.status,
                    responseText
                );


                profileMessage.textContent =
                    data.message ||
                    data.error ||
                    responseText ||
                    "Unable to upload profile photo.";

            }


        } catch (error) {

            console.error(
                "Profile image upload error:",
                error
            );


            profileMessage.textContent =
                "Unable to connect to the server.";

        } finally {

            saveProfileImageButton.disabled =
                false;

            saveProfileImageButton.textContent =
                "Save Photo";

            loadProfile();

        }

    }
);


//========================
// Remove image
//========================

removeProfileImageButton.addEventListener(
    "click",
    async function () {

        const confirmed =
            confirm(
                "Are you sure you want to remove your profile photo?"
            );

        if (!confirmed) {
            return;
        }


        removeProfileImageButton.disabled =
            true;

        removeProfileImageButton.textContent =
            "Removing...";

        profileMessage.textContent =
            "Removing profile photo...";


        try {

            const response =
                await apiRequest(
                    `${API_BASE_URL}/api/v1/profile/image`,
                    {
                        method: "DELETE"
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

                // Reset image

                profileImage.src =
                    DEFAULT_PROFILE_IMAGE;

                previousProfileImageUrl =
                    DEFAULT_PROFILE_IMAGE;


                selectedProfileImage = null;
                profileImageInput.value = "";


                if (profileImagePreviewUrl) {
                    URL.revokeObjectURL(profileImagePreviewUrl);
                    profileImagePreviewUrl = null;
                }


                // Hide View Photo

                viewProfileImageButton.style.display =
                    "none";


                // Hide Remove Photo completely

                removeProfileImageButton.style.display =
                    "none";


                // Hide upload controls

                saveProfileImageButton.style.display =
                    "none";

                cancelProfileImageButton.style.display =
                    "none";


                profileMessage.textContent =
                    "Profile photo removed successfully.";

            } else {

                profileMessage.textContent =
                    data.message ||
                    data.error ||
                    "Unable to remove profile photo.";

            }


        } catch (error) {

            console.error(
                "Remove profile image error:",
                error
            );


            profileMessage.textContent =
                "Unable to connect to the server.";

        } finally {

            removeProfileImageButton.disabled =
                false;

            removeProfileImageButton.textContent =
                "Remove Photo";

        }

    }
);

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


        if (data.profileImageUrl) {

            profileImage.src =
                data.profileImageUrl;

            previousProfileImageUrl =
                data.profileImageUrl;

            viewProfileImageButton.style.display =
                "inline-block";

            removeProfileImageButton.style.display =
                "inline-block";

        } else {

            profileImage.src =
                DEFAULT_PROFILE_IMAGE;

            previousProfileImageUrl =
                DEFAULT_PROFILE_IMAGE;

            viewProfileImageButton.style.display =
                "none";

            removeProfileImageButton.style.display =
                "none";
        }


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