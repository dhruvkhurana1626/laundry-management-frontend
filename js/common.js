const AUTH = localStorage.getItem("auth");

function fetchWithAuth(url, options = {}) {

  return fetch(url, {

    ...options,

    headers: {

      ...(options.headers || {}),

      "Authorization": AUTH,

      "Content-Type": "application/json"

    }

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

function formatDate(dateString) {

  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN");

}