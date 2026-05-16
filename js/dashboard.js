const BASE_URL = "http://13.234.136.7:8080/api/v1/dashboard";

// ---------- SAFE EVENT BINDING ----------

const addGarmentBtn = document.getElementById("addGarmentBtn");
if (addGarmentBtn) addGarmentBtn.addEventListener("click", addGarment);

const createOrderBtn = document.getElementById("createOrderBtn");
if (createOrderBtn) createOrderBtn.addEventListener("click", createOrder);

const loadDashboardBtn = document.getElementById("loadDashboardBtn");
if (loadDashboardBtn) loadDashboardBtn.addEventListener("click", loadDashboard);

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) logoutBtn.addEventListener("click", logout);

const ordersPageBtn = document.getElementById("ordersPageBtn");
if (ordersPageBtn) {
  ordersPageBtn.addEventListener("click", () => {
    window.location.href = "orders.html";
  });
}

// ---------- FUNCTIONS ----------

// add garment row
function addGarment() {
  const container = document.getElementById("garments-container");
  if (!container) return;

  const div = document.createElement("div");

  div.innerHTML = `
    <select class="type">
      <option>SHIRT</option>
      <option>PANT</option>
      <option>JEANS</option>
      <option>COAT_PANT</option>
      <option>BLAZER</option>
      <option>SAREE</option>
      <option>LEHENGA</option>
      <option>LADIEST_SUIT</option>
    </select>

    <input type="number" class="qty" placeholder="Quantity" />

    <button class="removeBtn">Remove</button>
  `;

  div.querySelector(".removeBtn").addEventListener("click", () => div.remove());

  container.appendChild(div);
}

// auto add garment row ONLY if container exists
if (document.getElementById("garments-container")) {
  addGarment();
}

//auto loading Dashboard
document.addEventListener("DOMContentLoaded", () => {

  // if dashboard section exists → load it
  if (document.getElementById("dashboard")) {
    loadDashboard();
  }

});

// dashboard
function loadDashboard() {

  const el =
    document.getElementById("dashboard");

  // loading state
  el.innerHTML = `
    <div class="loading-card">
      Loading Dashboard...
    </div>
  `;

  fetchWithAuth(BASE_URL)

    .then(res => {

      if (!res.ok) {
        throw new Error("Dashboard Failed");
      }

      return res.json();

    })

    .then(data => {

      const currentMonth =
        new Date().toLocaleString("en-IN", {
          month: "long",
          year: "numeric"
        });

      el.innerHTML = `

        <h2 class="dashboard-heading">
          ${currentMonth} Overview
        </h2>

        <div class="dashboard-top">

          <div class="card">
            <h4>This Month Orders</h4>
            <p>${data.totalOrders}</p>
          </div>

          <div class="card">
            <h4>This Month Revenue</h4>
            <p>₹${data.totalAmount || data.totalRevenue}</p>
          </div>

        </div>

        <div class="dashboard-bottom">

          <div class="card">
            <h4>Received</h4>
            <p>${data.ordersPerStatus?.RECEIVED || 0}</p>
          </div>

          <div class="card">
            <h4>Processing</h4>
            <p>${data.ordersPerStatus?.PROCESSING || 0}</p>
          </div>

          <div class="card">
            <h4>Ready</h4>
            <p>${data.ordersPerStatus?.READY || 0}</p>
          </div>

          <div class="card">
            <h4>Delivered</h4>
            <p>${data.ordersPerStatus?.DELIVERED || 0}</p>
          </div>

        </div>

      `;

    })

    .catch(err => {

      console.error(err);

      el.innerHTML = `
        <div class="error-card">
          Failed to load dashboard ❌
        </div>
      `;

    });

}

// create Orders
function createOrder() {

  const createBtn =
    document.getElementById("createOrderBtn");

  const garments = [];

  document.querySelectorAll("#garments-container div")
    .forEach(row => {

      const type =
        row.querySelector(".type").value;

      const qty =
        parseInt(row.querySelector(".qty").value);

      if (qty > 0) {

        garments.push({
          type,
          quantity: qty
        });

      }

  });

  if (garments.length === 0) {

    showToast("Add at least one garment ❌");

    return;

  }

  const data = {

    customerName:
      document.getElementById("name").value,

    phone:
      document.getElementById("phone").value,

    email:
      document.getElementById("email").value,

    garmentRequestList: garments

  };

  // loading state
  createBtn.disabled = true;
  createBtn.innerText = "Creating...";

  fetchWithAuth(
    "http://13.234.136.7:8080/api/v1/order",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  )

  .then(res => {

    if (!res.ok) {
      throw new Error("Failed");
    }

    return res.json();

  })

  .then(() => {

    // clear inputs
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";

    document.getElementById("garments-container")
      .innerHTML = "";

    // add fresh row
    addGarment();

    // reload
    loadDashboard();

    // success toast
    showToast("Order Created ✔");

  })

  .catch(err => {

    console.error(err);

    showToast("Order Creation Failed ❌");

  })

  .finally(() => {

    createBtn.disabled = false;
    createBtn.innerText = "Create Order";

  });

}

// logout
function logout() {
  localStorage.removeItem("auth");
  window.location.href = "index.html";
}