// ================================
// DASHBOARD ELEMENTS
// ================================

const totalOrders =
    document.getElementById("totalOrders");

const receivedOrders =
    document.getElementById("receivedOrders");

const deliveredOrders =
    document.getElementById("deliveredOrders");

const ordersTableBody =
    document.getElementById("ordersTableBody");

const dashboardMessage =
    document.getElementById("dashboardMessage");

const logoutButton =
    document.getElementById("logoutButton");

const orderSearchInput =
    document.getElementById("orderSearchInput");

const searchOrderButton =
    document.getElementById("searchOrderButton");

const clearSearchButton =
    document.getElementById("clearSearchButton");


// ================================
// CREATE ORDER MODAL
// ================================

const orderModal =
    document.getElementById("orderModal");

const addOrderButton =
    document.getElementById("addOrderButton");

const closeOrderModal =
    document.getElementById("closeOrderModal");

const cancelOrderButton =
    document.getElementById("cancelOrderButton");

const orderForm =
    document.getElementById("orderForm");

const garmentsContainer =
    document.getElementById("garmentsContainer");

const addGarmentButton =
    document.getElementById("addGarmentButton");

const orderMessage =
    document.getElementById("orderMessage");

const createOrderButton =
    document.getElementById("createOrderButton");


// ================================
// VIEW ORDER MODAL
// ================================

const viewOrderModal =
    document.getElementById("viewOrderModal");

const closeViewOrderModal =
    document.getElementById("closeViewOrderModal");

const viewOrderId =
    document.getElementById("viewOrderId");

const viewCustomerName =
    document.getElementById("viewCustomerName");

const viewPhone =
    document.getElementById("viewPhone");

const viewEmail =
    document.getElementById("viewEmail");

const viewStatus =
    document.getElementById("viewStatus");

const viewTotalAmount =
    document.getElementById("viewTotalAmount");

const viewCreatedAt =
    document.getElementById("viewCreatedAt");

const viewGarments =
    document.getElementById("viewGarments");

const printOrderButton =
    document.getElementById("printOrderButton");

const whatsappOrderButton =
    document.getElementById("whatsappOrderButton");

const editOrderButton =
    document.getElementById("editOrderButton");

const deleteOrderButton =
    document.getElementById("deleteOrderButton");

const orderStatusSelect =
    document.getElementById("orderStatusSelect");

const updateStatusButton =
    document.getElementById("updateStatusButton");

let selectedOrder = null;

let isEditMode = false;

// ================================
// GARMENT TYPES
// ================================

const garmentTypes = [
    "SHIRT",
    "PANT",
    "JEANS",
    "COAT_PANT",
    "BLAZER",
    "SAREE",
    "LEHENGA"
];


// ================================
// LOAD RECENT ORDERS
// ================================

async function loadRecentOrders() {

    dashboardMessage.textContent = "";

    try {

        const search =
            orderSearchInput.value.trim();

        let url =
            `${API_BASE_URL}/api/v1/order/recent?page=0&size=10`;

        if (search) {

            url =
                `${API_BASE_URL}/api/v1/order?search=${encodeURIComponent(search)}&page=0`;
        }


        const response =
            await apiRequest(
                url,
                {
                    method: "GET"
                }
            );


        if (!response) {
            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Load orders failed:",
                errorText
            );

            dashboardMessage.textContent =
                "Unable to load orders.";

            return;
        }


        const orders =
            await response.json();


        console.log(
            "Orders:",
            orders
        );


        displayOrders(orders);

        updateStats(orders);


    } catch (error) {

        console.error(
            "Failed to load orders:",
            error
        );

        dashboardMessage.textContent =
            "Unable to load orders.";
    }
}


// ================================
// SEARCH
// ================================

if (searchOrderButton) {

    searchOrderButton.addEventListener(
        "click",
        function () {

            loadRecentOrders();

        }
    );

}


if (clearSearchButton) {

    clearSearchButton.addEventListener(
        "click",
        function () {

            orderSearchInput.value = "";

            loadRecentOrders();

        }
    );

}


if (orderSearchInput) {

    orderSearchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                loadRecentOrders();

            }

        }
    );

}


// ================================
// DISPLAY ORDERS
// ================================

function displayOrders(orders) {

    ordersTableBody.innerHTML = "";


    if (
        !Array.isArray(orders) ||
        orders.length === 0
    ) {

        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No orders found.
                </td>
            </tr>
        `;

        return;
    }


    orders.forEach(
        function (order) {

            const row =
                document.createElement("tr");


            let statusClass =
                "status-received";


            if (
                order.orderStatus === "DELIVERED"
            ) {

                statusClass =
                    "status-delivered";
            }


            row.innerHTML = `

                <td>
                    #${escapeHtml(order.id)}
                </td>

                <td>
                    ${escapeHtml(order.customerName)}
                </td>

                <td class="desktop-only">
                    ${escapeHtml(order.phone)}
                </td>

                <td>

                    <span
                        class="status ${statusClass}"
                    >
                        ${escapeHtml(order.orderStatus)}
                    </span>

                </td>

                <td class="desktop-only">
                    ₹${escapeHtml(order.totalAmount)}
                </td>

                <td>
                    ${formatDate(order.createdAt)}
                </td>

                <td>

                    <button
                        type="button"
                        class="view-order-button"
                    >
                        View
                    </button>

                </td>

            `;


            const viewButton =
                row.querySelector(
                    ".view-order-button"
                );


            viewButton.addEventListener(
                "click",
                function () {

                    openOrderDetails(order);

                }
            );


            ordersTableBody.appendChild(row);

        }
    );
}


// ================================
// UPDATE STATS
// ================================

function updateStats(orders) {

    if (!Array.isArray(orders)) {

        totalOrders.textContent = "0";

        receivedOrders.textContent = "0";

        deliveredOrders.textContent = "0";

        return;
    }


    totalOrders.textContent =
        orders.length;


    const received =
        orders.filter(
            function (order) {

                return (
                    order.orderStatus ===
                    "RECEIVED"
                );

            }
        ).length;


    const delivered =
        orders.filter(
            function (order) {

                return (
                    order.orderStatus ===
                    "DELIVERED"
                );

            }
        ).length;


    receivedOrders.textContent =
        received;

    deliveredOrders.textContent =
        delivered;
}


// ================================
// FORMAT DATE
// ================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
        return "-";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ================================
// ESCAPE HTML
// ================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;
}


// ================================
// CREATE ORDER MODAL
// ================================

if (addOrderButton) {

    addOrderButton.addEventListener(
        "click",
        function () {

            isEditMode = false;

            orderForm.reset();
            garmentsContainer.innerHTML = "";
            orderMessage.textContent = "";

            createOrderButton.textContent = "Create Order";

            orderModal.classList.add("active");

            addGarmentRow();
        }
    );

}


// ================================
// CLOSE CREATE ORDER MODAL
// ================================

function closeModal() {

    orderModal.classList.remove(
        "active"
    );

    orderForm.reset();

    garmentsContainer.innerHTML = "";

    orderMessage.textContent = "";
}


if (closeOrderModal) {

    closeOrderModal.addEventListener(
        "click",
        closeModal
    );

}


if (cancelOrderButton) {

    cancelOrderButton.addEventListener(
        "click",
        closeModal
    );

}


// ================================
// ADD GARMENT ROW
// ================================

function addGarmentRow(
    selectedType = "",
    selectedQuantity = ""
) {

    const selectedTypes =
        Array.from(
            document.querySelectorAll(
                ".garment-type"
            )
        )
            .map(
                function (select) {
                    return select.value;
                }
            )
            .filter(
                function (type) {
                    return type !== "";
                }
            );


    if (
        selectedType === "" &&
        selectedTypes.length >=
            garmentTypes.length
    ) {

        alert(
            "All garment types have already been added."
        );

        return;
    }


    const row =
        document.createElement("div");


    row.className =
        "garment-row";


    row.innerHTML = `

        <select
            class="garment-type"
            required
        >

            <option value="">
                Select garment
            </option>

            ${garmentTypes
                .map(
                    function (type) {

                        const alreadySelected =
                            selectedTypes.includes(
                                type
                            );


                        return `
                            <option
                                value="${type}"
                                ${
                                    type ===
                                    selectedType
                                        ? "selected"
                                        : ""
                                }
                                ${
                                    alreadySelected &&
                                    type !== selectedType
                                        ? "disabled"
                                        : ""
                                }
                            >
                                ${type}
                            </option>
                        `;

                    }
                )
                .join("")}

        </select>


        <input
            type="number"
            class="garment-quantity"
            min="1"
            step="1"
            placeholder="Quantity"
            value="${escapeHtml(selectedQuantity)}"
            required
        >


        <button
            type="button"
            class="remove-garment-button"
            aria-label="Remove garment"
        >
            ×
        </button>

    `;


    const removeButton =
        row.querySelector(
            ".remove-garment-button"
        );


    removeButton.addEventListener(
        "click",
        function () {

            row.remove();

            refreshGarmentOptions();

        }
    );


    const garmentSelect =
        row.querySelector(
            ".garment-type"
        );


    garmentSelect.addEventListener(
        "change",
        function () {

            refreshGarmentOptions();

        }
    );


    garmentsContainer.appendChild(row);

    refreshGarmentOptions();
}


// ================================
// REFRESH GARMENT OPTIONS
// ================================

function refreshGarmentOptions() {

    const selects =
        document.querySelectorAll(
            ".garment-type"
        );


    const selectedTypes =
        Array.from(selects)
            .map(
                function (select) {
                    return select.value;
                }
            )
            .filter(
                function (type) {
                    return type !== "";
                }
            );


    selects.forEach(
        function (select) {

            const currentValue =
                select.value;


            Array.from(
                select.options
            ).forEach(
                function (option) {

                    if (
                        option.value === ""
                    ) {

                        return;
                    }


                    option.disabled =
                        selectedTypes.includes(
                            option.value
                        ) &&
                        option.value !==
                            currentValue;

                }
            );

        }
    );
}


// ================================
// ADD GARMENT BUTTON
// ================================

if (addGarmentButton) {

    addGarmentButton.addEventListener(
        "click",
        function () {

            addGarmentRow();

        }
    );

}


// ================================
// CREATE ORDER
// ================================

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const customerName =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim();


            const garmentRows =
                document.querySelectorAll(
                    ".garment-row"
                );


            if (
                garmentRows.length === 0
            ) {

                orderMessage.textContent =
                    "Add at least one garment.";

                return;
            }


            const garmentRequestList = [];

            const selectedGarmentTypes =
                new Set();


            for (
                const row of garmentRows
            ) {

                const type =
                    row
                        .querySelector(
                            ".garment-type"
                        )
                        .value;


                const quantity =
                    Number(
                        row
                            .querySelector(
                                ".garment-quantity"
                            )
                            .value
                    );


                if (
                    !type ||
                    !Number.isInteger(quantity) ||
                    quantity < 1
                ) {

                    orderMessage.textContent =
                        "Please enter valid garment details.";

                    return;
                }


                if (
                    selectedGarmentTypes.has(
                        type
                    )
                ) {

                    orderMessage.textContent =
                        `Duplicate garment type: ${type}`;

                    return;
                }


                selectedGarmentTypes.add(type);


                garmentRequestList.push({

                    type: type,

                    quantity: quantity

                });

            }


            const orderData = {

                customerName:
                    customerName,

                phone:
                    phone,

                email:
                    email,

                garmentRequestList:
                    garmentRequestList

            };


            console.log(
                "Creating order:",
                orderData
            );


            createOrderButton.disabled =
                true;

            createOrderButton.textContent =
                isEditMode ? "Saving..." : "Creating...";

            orderMessage.textContent =
                isEditMode ? "Saving changes..." : "Creating order...";


            try {

                const url = isEditMode
                    ? `${API_BASE_URL}/api/v1/order/${selectedOrder.id}`
                    : `${API_BASE_URL}/api/v1/order`;

                const method = isEditMode
                    ? "PATCH"
                    : "POST";

                const response =
                    await apiRequest(
                        url,
                        {
                            method: method,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    orderData
                                )
                        }
                    );


                if (!response) {
                    return;
                }


                if (!response.ok) {

                    const errorData =
                        await response.text();


                    console.error(
                        "Create order failed:",
                        errorData
                    );


                    orderMessage.textContent =
                        errorData ||
                        "Unable to create order.";

                    return;
                }


                let createdOrder = null;


                try {

                    createdOrder =
                        await response.json();

                } catch (error) {

                    console.log(
                        "Order created without response body."
                    );
                }


                console.log(
                    "Created order:",
                    createdOrder
                );


                orderMessage.textContent =
                    isEditMode
                        ? "Order updated successfully."
                        : "Order created successfully.";


                await loadRecentOrders();


                setTimeout(
                    function () {

                        closeModal();

                    },
                    500
                );


            } catch (error) {

                console.error(
                    "Create order error:",
                    error
                );


                orderMessage.textContent =
                    "Unable to connect to the server.";


            } finally {

                createOrderButton.disabled =
                    false;

                createOrderButton.textContent =
                    "Create Order";

            }

        }
    );

}


// ================================
// VIEW ORDER DETAILS
// ================================

function openOrderDetails(order) {

    selectedOrder =
        order;


    viewOrderId.textContent =
        `#${escapeHtml(order.id)}`;


    viewCustomerName.textContent =
        order.customerName || "-";


    viewPhone.textContent =
        order.phone || "-";


    viewEmail.textContent =
        order.email || "-";


    viewStatus.textContent =
        order.orderStatus || "-";


    viewTotalAmount.textContent =
        order.totalAmount !== null &&
        order.totalAmount !== undefined
            ? `₹${order.totalAmount}`
            : "-";


    viewCreatedAt.textContent =
        formatDate(
            order.createdAt
        );


    orderStatusSelect.value =
        order.orderStatus || "RECEIVED";


    displayOrderGarments(
        order.garments
    );


    viewOrderModal.classList.add(
        "active"
    );
}


// ================================
// DISPLAY ORDER GARMENTS
// ================================

function displayOrderGarments(
    garments
) {

    viewGarments.innerHTML = "";


    if (
        !Array.isArray(garments) ||
        garments.length === 0
    ) {

        viewGarments.innerHTML =
            "<p>No garments found.</p>";

        return;
    }


    garments.forEach(
        function (garment) {

            const garmentRow =
                document.createElement(
                    "div"
                );


            garmentRow.className =
                "garment-detail-row";


            garmentRow.innerHTML = `

                <span>
                    ${escapeHtml(
                        garment.type
                    )}
                </span>

                <span>
                    Quantity:
                    ${escapeHtml(
                        garment.quantity
                    )}
                </span>

            `;


            viewGarments.appendChild(
                garmentRow
            );

        }
    );
}


// ================================
// CLOSE VIEW MODAL
// ================================

function closeViewModal() {

    viewOrderModal.classList.remove(
        "active"
    );

    selectedOrder = null;
}


if (closeViewOrderModal) {

    closeViewOrderModal.addEventListener(
        "click",
        closeViewModal
    );

}


// ================================
// CLICK OUTSIDE MODAL
// ================================

if (orderModal) {

    orderModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                orderModal
            ) {

                closeModal();

            }

        }
    );

}


if (viewOrderModal) {

    viewOrderModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                viewOrderModal
            ) {

                closeViewModal();

            }

        }
    );

}


// ================================
// ESC KEY
// ================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        if (
            orderModal &&
            orderModal.classList.contains(
                "active"
            )
        ) {

            closeModal();

        }


        if (
            viewOrderModal &&
            viewOrderModal.classList.contains(
                "active"
            )
        ) {

            closeViewModal();

        }

    }
);


// ================================
// PRINT ORDER
// ================================

if (printOrderButton) {

    printOrderButton.addEventListener(
        "click",
        function () {

            if (!selectedOrder) {
                return;
            }


            window.print();

        }
    );

}


// ================================
// WHATSAPP
// ================================

if (whatsappOrderButton) {

    whatsappOrderButton.addEventListener(
        "click",
        function () {

            if (!selectedOrder) {
                return;
            }


            const garments =
                Array.isArray(
                    selectedOrder.garments
                )
                    ? selectedOrder.garments
                    : [];


            const garmentText =
                garments
                    .map(
                        function (garment) {

                            return (
                                `${garment.type} x ${garment.quantity}`
                            );

                        }
                    )
                    .join("\n");


            const phone =
                String(
                    selectedOrder.phone || ""
                )
                    .replace(
                        /\D/g,
                        ""
                    );


            const message =
`Laundry Order #${selectedOrder.id}

Customer: ${selectedOrder.customerName}
Phone: ${selectedOrder.phone}

Garments:
${garmentText}

Status: ${selectedOrder.orderStatus}
Total: ₹${selectedOrder.totalAmount}`;


            const whatsappUrl =
                `https://wa.me/91${phone}?text=${encodeURIComponent(
                    message
                )}`;


            window.open(
                whatsappUrl,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


// ================================
// EDIT ORDER
// ================================

if (editOrderButton) {

    editOrderButton.addEventListener(
        "click",
        function () {

            if (!selectedOrder) {
                return;
            }

            // Save the order before closing view modal
            const orderToEdit = selectedOrder;

            // Enable edit mode
            isEditMode = true;

            console.log(
                "Editing order:",
                orderToEdit
            );

            // Close view modal
            closeViewModal();

            // Restore selected order because closeViewModal()
            // sets selectedOrder = null
            selectedOrder = orderToEdit;

            // Reset form
            orderForm.reset();
            garmentsContainer.innerHTML = "";
            orderMessage.textContent = "";

            // Fill customer details
            document.getElementById("customerName").value =
                orderToEdit.customerName || "";

            document.getElementById("phone").value =
                orderToEdit.phone || "";

            document.getElementById("email").value =
                orderToEdit.email || "";

            // Load existing garments
            if (Array.isArray(orderToEdit.garments)) {

                orderToEdit.garments.forEach(
                    function (garment) {

                        addGarmentRow(
                            garment.type,
                            garment.quantity
                        );

                    }
                );
            }

            // Change button text
            createOrderButton.textContent =
                "Save Changes";

            // Open order modal
            orderModal.classList.add("active");
        }
    );

}


// ================================
// UPDATE ORDER STATUS
// ================================

if (updateStatusButton) {

    updateStatusButton.addEventListener(
        "click",
        async function () {

            if (!selectedOrder) {
                return;
            }

            const newStatus =
                orderStatusSelect.value;

            if (
                newStatus ===
                selectedOrder.orderStatus
            ) {
                return;
            }

            updateStatusButton.disabled =
                true;

            updateStatusButton.textContent =
                "Updating...";

            try {

                const response =
                    await apiRequest(
                        `${API_BASE_URL}/api/v1/order/${selectedOrder.id}/status?status=${encodeURIComponent(newStatus)}`,
                        {
                            method: "PUT"
                        }
                    );

                if (!response) {
                    return;
                }

                if (!response.ok) {

                    const responseText =
                        await response.text();

                    let errorMessage =
                        "Unable to update order status.";

                    try {

                        const errorData =
                            responseText
                                ? JSON.parse(responseText)
                                : {};

                        errorMessage =
                            errorData.message ||
                            errorMessage;

                    } catch (error) {

                        console.error(
                            "Status update response is not JSON:",
                            responseText
                        );
                    }

                    console.error(
                        "Status update failed:",
                        responseText
                    );

                    alert(errorMessage);

                    return;
                }

                const updatedOrder =
                    await response.json();

                console.log(
                    "Updated order:",
                    updatedOrder
                );

                selectedOrder =
                    updatedOrder;

                viewStatus.textContent =
                    updatedOrder.orderStatus;

                orderStatusSelect.value =
                    updatedOrder.orderStatus;

                await loadRecentOrders();

                closeViewModal();

            } catch (error) {

                console.error(
                    "Status update error:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );

            } finally {

                updateStatusButton.disabled =
                    false;

                updateStatusButton.textContent =
                    "Update Status";
            }

        }
    );

}


// ================================
// DELETE ORDER
// ================================

if (deleteOrderButton) {

    deleteOrderButton.addEventListener(
        "click",
        async function () {

            if (!selectedOrder) {
                return;
            }


            const confirmed =
                confirm(
                    `Delete Order #${selectedOrder.id}?\n\nThis action cannot be undone.`
                );


            if (!confirmed) {
                return;
            }


            deleteOrderButton.disabled =
                true;


            deleteOrderButton.textContent =
                "Deleting...";


            try {

                const response =
                    await apiRequest(
                        `${API_BASE_URL}/api/v1/order/${selectedOrder.id}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response) {
                    return;
                }


                if (!response.ok) {

                    const errorData =
                        await response.text();


                    console.error(
                        "Delete order failed:",
                        errorData
                    );


                    alert(
                        errorData ||
                        "Unable to delete order."
                    );

                    return;
                }


                closeViewModal();


                await loadRecentOrders();


            } catch (error) {

                console.error(
                    "Delete order error:",
                    error
                );


                alert(
                    "Unable to connect to the server."
                );


            } finally {

                deleteOrderButton.disabled =
                    false;

                deleteOrderButton.textContent =
                    "Delete Order";

            }

        }
    );

}


// ================================
// LOGOUT
// ================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            logoutUser();

        }
    );

}


// ================================
// INITIALIZE
// ================================

loadRecentOrders();