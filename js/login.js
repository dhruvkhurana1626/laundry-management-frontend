const BASE_URL =
  "http://localhost:8080/api/v1/order";

function login(event) {

  event.preventDefault();

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  const token =
    "Basic " + btoa(username + ":" + password);

  fetch(BASE_URL, {

    method: "GET",

    headers: {
      "Authorization": token
    }

  })

  .then(res => {

    if (!res.ok) {
      throw new Error("Invalid Credentials");
    }

    return res.json();

  })

  .then(() => {

    localStorage.setItem("auth", token);

    window.location.href = "index.html";

  })

  .catch(err => {

    document.getElementById("error")
      .innerText = err.message;

  });

}