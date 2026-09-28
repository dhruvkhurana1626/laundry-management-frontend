const API_BASE_URL = "https://behalf-brush-wellness-nil.trycloudflare.com";

async function apiRequest(url, options = {}) {

    let accessToken =
        sessionStorage.getItem("accessToken");

    const refreshToken =
        sessionStorage.getItem("refreshToken");


    // Add Authorization header
    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };


    let response = await fetch(url, options);


    // Access token expired
    if (response.status === 401) {

        if (!refreshToken) {

            logoutUser();

            return null;
        }


        // Ask backend for new access token
        const refreshResponse = await fetch(
            `${API_BASE_URL}/api/v1/auth/refresh`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            }
        );


        if (!refreshResponse.ok) {

            logoutUser();

            return null;
        }


        const data =
            await refreshResponse.json();


        // Store new access token
        sessionStorage.setItem(
            "accessToken",
            data.accessToken
        );


        // Update Authorization header
        options.headers.Authorization =
            `Bearer ${data.accessToken}`;


        // Retry original request
        response = await fetch(url, options);
    }


    return response;
}


function logoutUser() {

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    window.location.href = "login.html";
}