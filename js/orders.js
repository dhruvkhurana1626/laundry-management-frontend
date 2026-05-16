const BASE_URL = "http://13.234.136.7:8080/api/v1/order";

//automatically load orders 
document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("ordersBody")) {
    loadOrders();
  }

});

//Auto Loading All Orders
function loadOrders() {
  fetchWithAuth(`${BASE_URL}/recent`)
    .then(res => res.json())
    .then(data => renderOrders(data));
}

//render all orders
function renderOrders(list) {

  const tbody = document.getElementById("ordersBody");

  if (!tbody) return;

  tbody.innerHTML = "";

  list.forEach(order => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${order.customerName}</td>
      <td class="hide-mobile">${order.phone}</td>
      <td>${order.orderStatus}</td>
      <td class="hide-mobile">${formatDate(order.createdAt)}</td>
      <td>₹${order.totalAmount}</td>
      <td class="hide-mobile">${order.id}</td>

      <td>
        <button class="viewBtn">View</button>
      </td>

      <td>
        <button class="deleteBtn">🗑️</button>
      </td>
    `;

    tr.querySelector(".viewBtn")
      .addEventListener("click", () => {
        // hit the view Detail
        openDetailsModal(order);
      });

    tbody.appendChild(tr);

    tr.querySelector(".deleteBtn")
      .addEventListener("click", () => {
        // delete the Query
        deleteOrder(order.id);

    });

  });

}

// delete order
function deleteOrder(orderId) {

  const deleteModal =
    document.getElementById("deleteModal");

  deleteModal.style.display = "block";

  const confirmBtn =
    document.getElementById("confirmDeleteBtn");

  const cancelBtn =
    document.getElementById("cancelDeleteBtn");

  // cancel
  cancelBtn.onclick = () => {

    deleteModal.style.display = "none";

  };

  // confirm delete
  confirmBtn.onclick = () => {

    confirmBtn.disabled = true;
    confirmBtn.innerText = "Deleting...";

    fetchWithAuth(`${BASE_URL}/${orderId}`, {

      method: "DELETE"

    })

    .then(res => {

      if (!res.ok) {
        throw new Error("Delete Failed");
      }

      deleteModal.style.display = "none";

      showToast("Order Deleted 🗑️");

      loadOrders();

    })

    .catch(err => {

      console.error(err);

      showToast("Delete Failed ❌");

    })

    .finally(() => {

      confirmBtn.disabled = false;
      confirmBtn.innerText = "Yes, Delete";

    });

  };

}


//open mode - line 81
function openDetailsModal(order) {

  const modal = document.getElementById("detailsModal");
  const modalData = document.getElementById("modalData");

  let garmentsHtml = "";

    if (order.garments) {

    order.garments.forEach(g => {

      garmentsHtml += `
        <tr>
            <td>${g.type}</td>
            <td>${g.quantity}</td>
            <td>₹${g.pricePerItem}</td>
            <td>₹${g.quantity * g.pricePerItem}</td>
        </tr>
        `;

    });

  }

  modalData.innerHTML = `

    <h2>Order #${order.id}</h2>

    <p><b>Name:</b> ${order.customerName}</p>
    <p><b>Phone:</b> ${order.phone}</p>
    <p><b>Email:</b> ${order.email || "-"}</p>
    <p><b>Status:</b> ${order.orderStatus}</p>
    <p><b>Total:</b> ₹${order.totalAmount}</p>

    <h3>Garments</h3>

    <table class="garment-table">

            <thead>
                <tr>
                <th>Type</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                </tr>
            </thead>

            <tbody>
                ${garmentsHtml}
            </tbody>

      </table>
  

    <select id="modalStatus">

      <option>RECEIVED</option>
      <option>PROCESSING</option>
      <option>READY</option>
      <option>DELIVERED</option>

    </select>

    <button id="updateModalBtn">
    Update Status
    </button>

    <button id="printBtn">
      Print
    </button>

  `;

  modal.style.display = "block";

  //update button listener
  document.getElementById("updateModalBtn")
  .addEventListener("click", () => {

    const status =
      document.getElementById("modalStatus").value;

    updateStatus(order.id, status);

  });

  //printBtn listener
  document.getElementById("printBtn")
  .addEventListener("click", () => {

    const printContents =
      document.getElementById("modalData").innerHTML;

    const printWindow =
      window.open("", "", "width=900,height=700");

    printWindow.document.write(`

      <html>
        <head>
          <title>Order Receipt</title>
          <style>
            body{
              font-family: Arial;
              padding: 20px;
            }
            h2,h3{
              margin-bottom: 10px;
            }
            p{
              margin: 6px 0;
            }
            table{
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td{
              border: 2px solid #000;
              padding: 10px;
              text-align: center;
            }
            button,
            select{
              display:none;
            }
          </style>

        </head>
        <body>
          ${printContents}
        </body>
      </html>

    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

  });

}

//update status - 213 line
function updateStatus(orderId, status) {

  const updateBtn =
    document.getElementById("updateModalBtn");

  updateBtn.disabled = true;
  updateBtn.innerText = "Updating...";

  fetchWithAuth(
    `${BASE_URL}/${orderId}/status?status=${status}`,
    {
      method: "PUT"
    }
  )
  .then(res => {

    if (!res.ok) {
      throw new Error("Failed to update");
    }

    return res.json();

  })
  .then(() => {

    // close modal
    document.getElementById("detailsModal")
      .style.display = "none";

    // reload table
    loadOrders();

    // success toast/message
    showToast("Status Updated ✔");

  })
  .catch(err => {

    showToast("Update Failed ❌");

    console.error(err);

  })
  .finally(() => {

    updateBtn.disabled = false;
    updateBtn.innerText = "Update Status";

  });

}

function showToast(message) {

  const toast = document.createElement("div");

  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);

}

const closeModal = document.getElementById("closeModal");

if (closeModal) {

  closeModal.addEventListener("click", () => {

    document.getElementById("detailsModal").style.display = "none";

  });

}

//back button from orders page
const backBtn = document.getElementById("backBtn");

if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
}

//Search Button
const searchBtn =
  document.getElementById("searchBtn");

if (searchBtn) {

  searchBtn.addEventListener("click", () => {

    searchOrders();

  });

}

//allowing Enter key to work
document.getElementById("searchInput")
  .addEventListener("keypress", (e) => {

    if(e.key === "Enter") {
      searchOrders();
    }

});

//search order function call
function searchOrders() {

  const search =
    document.getElementById("searchInput").value;

  const status =
    document.getElementById("statusFilter").value;

  const days =
    document.getElementById("daysFilter").value;

  let url =
    `${BASE_URL}?page=0`;

  // search
  if (search) {
    url += `&search=${search}`;
  }

  // status
  if (status) {
    url += `&status=${status}`;
  }

  // days
  if (days) {
    url += `&days=${days}`;
  }

  fetchWithAuth(url)

    .then(res => {

      if (!res.ok) {
        throw new Error("Search Failed");
      }

      return res.json();

    })

    .then(data => {

      renderOrders(data);

      showToast("Search Complete ✔");

    })

    .catch(err => {

      console.error(err);

      showToast("Search Failed ❌");

    });

}
