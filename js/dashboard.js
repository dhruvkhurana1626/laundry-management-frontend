const API_BASE_URL = "http://13.205.57.206:8080";

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

    try {

        const search =
        orderSearchInput.value.trim();

        let url =
            `${API_BASE_URL}/api/v1/order/recent?page=0&size=1`;

        if (search) {

            url =
                `${API_BASE_URL}/api/v1/order?search=${encodeURIComponent(search)}&page=0`;

        }

        const response = await apiRequest(
            url,
            {
                method: "GET"
            }
        );


        if (!response) {
            return;
        }


        if (!response.ok) {

            dashboardMessage.textContent =
                "Unable to load orders.";

            return;
        }


        const orders =
            await response.json();


        console.log(
            "Recent orders:",
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

searchOrderButton.addEventListener(
    "click",
    function () {

        loadRecentOrders();

    }
);

clearSearchButton.addEventListener(
    "click",
    function () {

        orderSearchInput.value = "";

        loadRecentOrders();

    }
);

// ================================
// DISPLAY ORDERS
// ================================

function displayOrders(orders) {

    ordersTableBody.innerHTML = "";


    if (!orders || orders.length === 0) {

        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No orders found.
                </td>
            </tr>
        `;

        return;
    }


    orders.forEach(function (order) {

        const row =
            document.createElement("tr");


        let statusClass =
            "status-received";


        if (order.orderStatus === "DELIVERED") {

            statusClass =
                "status-delivered";

        }


        row.innerHTML = `

            <td>
                #${order.id}
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
                    ${order.orderStatus}
                </span>

            </td>

            <td class="desktop-only">
                ₹${order.totalAmount}
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

    });
}


// ================================
// UPDATE STATS
// ================================

function updateStats(orders) {

    totalOrders.textContent =
        orders.length;


    const received =
        orders.filter(function (order) {

            return order.orderStatus === "RECEIVED";

        }).length;


    const delivered =
        orders.filter(function (order) {

            return order.orderStatus === "DELIVERED";

        }).length;


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

    if (value === null || value === undefined) {
        return "";
    }


    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;
}


// ================================
// CREATE ORDER MODAL
// ================================

addOrderButton.addEventListener(
    "click",
    function () {

        orderForm.reset();

        garmentsContainer.innerHTML = "";

        orderMessage.textContent = "";

        orderModal.classList.add(
            "active"
        );

        addGarmentRow();

    }
);


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


closeOrderModal.addEventListener(
    "click",
    closeModal
);


cancelOrderButton.addEventListener(
    "click",
    closeModal
);


// ================================
// ADD GARMENT ROW
// ================================

function addGarmentRow(
    selectedType = "",
    selectedQuantity = ""
) {

    const selectedTypes = Array.from(
        document.querySelectorAll(".garment-type")
    )
    .map(function (select) {
        return select.value;
    })
    .filter(function (type) {
        return type !== "";
    });


    if (
        selectedType === "" &&
        selectedTypes.length >= garmentTypes.length
    ) {
        alert("All garment types have already been added.");
        return;
    }


    const row =
        document.createElement("div");

    row.className = "garment-row";


    row.innerHTML = `

        <select class="garment-type">

            <option value="">
                Select garment
            </option>

            ${garmentTypes.map(function (type) {

                const alreadySelected =
                    selectedTypes.includes(type);

                return `
                    <option
                        value="${type}"
                        ${type === selectedType ? "selected" : ""}
                        ${alreadySelected && type !== selectedType ? "disabled" : ""}
                    >
                        ${type}
                    </option>
                `;

            }).join("")}

        </select>


        <input
            type="number"
            class="garment-quantity"
            min="1"
            placeholder="Quantity"
            value="${selectedQuantity}"
        >


        <button
            type="button"
            class="remove-garment-button"
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
        row.querySelector(".garment-type");


    garmentSelect.addEventListener(
        "change",
        function () {

            refreshGarmentOptions();

        }
    );


    garmentsContainer.appendChild(row);

    refreshGarmentOptions();
}


//Refresh Garment Options
function refreshGarmentOptions() {

    const selects =
        document.querySelectorAll(
            ".garment-type"
        );


    const selectedTypes =
        Array.from(selects)
            .map(function (select) {
                return select.value;
            })
            .filter(function (type) {
                return type !== "";
            });


    selects.forEach(function (select) {

        const currentValue =
            select.value;


        Array.from(select.options).forEach(
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
                    option.value !== currentValue;

            }
        );

    });
}

// ================================
// ADD GARMENT BUTTON
// ================================

addGarmentButton.addEventListener(
    "click",
    function () {

        addGarmentRow();

    }
);

// ================================
// CREATE ORDER
// ================================

orderForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const customerName =
            document
                .getElementById("customerName")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const garmentRows =
            document.querySelectorAll(
                ".garment-row"
            );


        if (garmentRows.length === 0) {

            orderMessage.textContent =
                "Add at least one garment.";

            return;
        }


        const garmentRequestList = [];


        for (const row of garmentRows) {

            const type =
                row
                    .querySelector(".garment-type")
                    .value;


            const quantity =
                Number(
                    row
                        .querySelector(
                            ".garment-quantity"
                        )
                        .value
                );


            if (!type || quantity < 1) {

                orderMessage.textContent =
                    "Please enter valid garment details.";

                return;
            }


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
            "Creating...";

        orderMessage.textContent =
            "Creating order...";


        try {

            const response =
                await apiRequest(
                    `${API_BASE_URL}/api/v1/order`,
                    {
                        method: "POST",

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
                    "Unable to create order.";

                return;
            }


            const createdOrder =
                await response.json();


            console.log(
                "Created order:",
                createdOrder
            );


            orderMessage.textContent =
                "Order created successfully.";


            setTimeout(
                function () {

                    closeModal();

                    loadRecentOrders();

                },
                700
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


// ================================
// VIEW ORDER DETAILS
// ================================

function openOrderDetails(order) {

    selectedOrder =
        order;


    viewOrderId.textContent =
        `#${order.id}`;


    viewCustomerName.textContent =
        order.customerName;


    viewPhone.textContent =
        order.phone;


    viewEmail.textContent =
        order.email;


    viewStatus.textContent =
        order.orderStatus;


    viewTotalAmount.textContent =
        `₹${order.totalAmount}`;


    viewCreatedAt.textContent =
        formatDate(
            order.createdAt
        );


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
        !garments ||
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
                    ${garment.quantity}
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

if (closeViewOrderModal) {

    closeViewOrderModal.addEventListener(
        "click",
        function () {

            viewOrderModal.classList.remove(
                "active"
            );

        }
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
                event.target === orderModal
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

                viewOrderModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


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


            const garmentText =
                selectedOrder.garments
                    .map(
                        function (garment) {

                            return `${garment.type} x ${garment.quantity}`;

                        }
                    )
                    .join("\n");


            const message =

`Laundry Order #${selectedOrder.id}

Customer: ${selectedOrder.customerName}
Phone: ${selectedOrder.phone}

Garments:
${garmentText}

Status: ${selectedOrder.orderStatus}
Total: ₹${selectedOrder.totalAmount}`;


            const whatsappUrl =
                `https://wa.me/91${selectedOrder.phone}?text=${encodeURIComponent(message)}`;


            window.open(
                whatsappUrl,
                "_blank"
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


            console.log(
                "Edit order:",
                selectedOrder
            );


            /*
             * The frontend button is ready.
             *
             * Actual saving requires a backend
             * PATCH /api/v1/order/{id} endpoint.
             *
             * We will connect this after that
             * endpoint exists.
             */


            alert(
                "Order editing will be connected to the order update API."
            );

        }
    );

}

// ================================
// UPDATE ORDER STATUS
// ================================

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


        updateStatusButton.disabled = true;

        updateStatusButton.textContent =
            "Updating...";


        try {

            const response = await apiRequest(
                `${API_BASE_URL}/api/v1/order/${selectedOrder.id}/status?status=${encodeURIComponent(newStatus)}`,
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
                    "Status update failed:",
                    errorData
                );

                alert(
                    "Unable to update order status."
                );

                return;
            }


            const updatedOrder =
                await response.json();


            console.log(
                "Updated order:",
                updatedOrder
            );


            // Update selected order

            selectedOrder =
                updatedOrder;


            // Update status displayed
            // inside the modal

            viewStatus.textContent =
                updatedOrder.orderStatus;


            // Update dropdown

            orderStatusSelect.value =
                updatedOrder.orderStatus;


            // Refresh dashboard orders

            await loadRecentOrders();


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

// ===============================
// DELETE ORDER
// ===============================
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
                    "Unable to delete order."
                );

                return;
            }


            viewOrderModal.classList.remove(
                "active"
            );


            selectedOrder =
                null;


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

loadRecentOrders();