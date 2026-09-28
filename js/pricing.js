const API_BASE_URL = "http://13.205.57.206:8080";

const pricingContainer =
    document.getElementById("pricingContainer");

const pricingMessage =
    document.getElementById("pricingMessage");

const logoutButton =
    document.getElementById("logoutButton");


// ================================
// LOAD PRICING
// ================================

async function loadPricing() {

    try {

        const response = await apiRequest(
            `${API_BASE_URL}/api/v1/pricing`,
            {
                method: "GET"
            }
        );


        if (!response) {
            return;
        }


        if (!response.ok) {

            pricingMessage.textContent =
                "Unable to load pricing.";

            return;
        }


        const pricingList =
            await response.json();


        console.log(
            "Pricing response:",
            pricingList
        );


        displayPricing(pricingList);


    } catch (error) {

        console.error(
            "Failed to load pricing:",
            error
        );

        pricingMessage.textContent =
            "Unable to load pricing.";
    }
}


// ================================
// DISPLAY PRICING
// ================================

function displayPricing(pricingList) {

    pricingContainer.innerHTML = "";


    pricingList.forEach(function (pricing) {

        const card =
            document.createElement("div");

        card.className = "pricing-card";


        card.innerHTML = `

            <div class="garment-name">
                ${pricing.garmentType}
            </div>

            <div class="current-price">
                Current Price: ₹${pricing.price}
            </div>

            <input
                type="number"
                class="price-input"
                value="${pricing.price}"
                min="1"
                step="0.01"
            >

            <button
                type="button"
                class="update-price-button"
            >
                Save Changes
            </button>

        `;


        const input =
            card.querySelector(".price-input");

        const button =
            card.querySelector(".update-price-button");


        button.addEventListener(
            "click",
            function () {

                updatePrice(
                    pricing.garmentType,
                    input,
                    button
                );

            }
        );


        pricingContainer.appendChild(card);

    });
}


// ================================
// UPDATE PRICE
// ================================

async function updatePrice(
    garmentType,
    input,
    button
) {

    const price =
        input.value.trim();


    // Validate price

    if (
        price === "" ||
        Number(price) <= 0
    ) {

        pricingMessage.textContent =
            "Price must be greater than 0.";

        return;
    }


    button.disabled = true;

    button.textContent =
        "Saving...";


    pricingMessage.textContent = "";


    try {

        const response = await apiRequest(
            `${API_BASE_URL}/api/v1/pricing/${encodeURIComponent(garmentType)}?price=${encodeURIComponent(price)}`,
            {
                method: "PUT"
            }
        );


        if (!response) {
            return;
        }


        if (!response.ok) {

            const errorData =
                await response.text();

            console.error(
                "Pricing update failed:",
                errorData
            );

            pricingMessage.textContent =
                "Unable to update price.";

            return;
        }


        /*
         * Your backend may return a PricingResponse.
         * If it does, read JSON.
         *
         * If it returns plain text instead,
         * this won't break the update flow.
         */

        let updatedPricing = null;

        const contentType =
            response.headers.get("content-type");


        if (
            contentType &&
            contentType.includes("application/json")
        ) {

            updatedPricing =
                await response.json();

            console.log(
                "Updated pricing:",
                updatedPricing
            );

        } else {

            const message =
                await response.text();

            console.log(
                "Pricing update response:",
                message
            );
        }


        pricingMessage.textContent =
            `${garmentType} price updated successfully.`;


        // Reload pricing so the UI shows
        // the latest value from backend.

        await loadPricing();


    } catch (error) {

        console.error(
            "Unable to update pricing:",
            error
        );

        pricingMessage.textContent =
            "Unable to connect to the server.";

    } finally {

        button.disabled = false;

        button.textContent =
            "Save Changes";
    }
}


// ================================
// LOGOUT
// ================================

logoutButton.addEventListener(
    "click",
    function () {

        logoutUser();

    }
);


// ================================
// INITIALIZE
// ================================

loadPricing();