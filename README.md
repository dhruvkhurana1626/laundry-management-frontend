<div align="center">

# 🧺 Laundry Management Frontend

**A clean, responsive web app for laundry shop owners to manage orders, prices and their business profile**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-000000?logo=vercel&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)

[🌐 Live App](https://laundry-management-frontend-swart.vercel.app) · [⚙️ Backend Repo](https://github.com/dhruvkhurana1626/laundry-management-backend)

</div>

---

## 📌 Overview

The frontend for the **Laundry Management System**. A shop owner can sign up, set prices for each garment type, create and track customer orders, and manage their business profile, all from one dashboard.

Built with **vanilla HTML, CSS and JavaScript**: no framework, no build step. It talks to a Spring Boot REST API using JWT authentication, with **automatic token refresh** so the user is never logged out unexpectedly.

---

## ✨ Features

| | Feature |
|---|---|
| 🔐 | **Register / Login** with show-hide password toggles and inline error messages |
| 🔁 | **Auto token refresh**: an expired access token is silently renewed and the failed request is retried |
| 🔑 | **Forgot, reset and change password** pages |
| 📊 | **Dashboard** with stat cards (Total, Received, Delivered) and a recent-orders table |
| 🔍 | **Search orders** by customer name, phone or email |
| ➕ | **Create orders** in a modal, adding as many garments as needed per order |
| ✏️ | **View, edit, delete and mark delivered** from the order details view |
| 💰 | **Pricing page**: see and update the price for every garment type |
| 👤 | **Profile page**: personal info, business info, PAN / GST, profile photo upload (JPG / PNG, max 5 MB) |
| 📱 | **Responsive design** for desktop and mobile |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (separate stylesheet per page) |
| Logic | Vanilla JavaScript (ES6, `fetch`, async/await) |
| Auth storage | `sessionStorage` (access + refresh tokens) |
| Hosting | Vercel (static site) |
| Backend | [Spring Boot REST API](https://github.com/dhruvkhurana1626/laundry-management-backend) |

---

## 🏗️ Architecture

Every page has its own HTML, CSS and JS file. All backend calls go through one shared helper, `api.js`, which attaches the token and handles expiry.

```mermaid
flowchart LR
    P[Pages<br/>login, register, dashboard,<br/>pricing, profile ...] --> J[Page scripts<br/>dashboard.js, pricing.js ...]
    J --> A[api.js<br/>apiRequest]
    A -->|Bearer token| B[Spring Boot REST API]
    B --> D[(MySQL)]
    A <-->|tokens| S[(sessionStorage)]
```

---

## 🔑 Auto Token Refresh

```mermaid
sequenceDiagram
    participant UI as Page script
    participant API as api.js
    participant BE as Backend

    UI->>API: apiRequest(url)
    API->>BE: Request + Bearer access token
    BE-->>API: 401 (access token expired)
    API->>BE: POST /auth/refresh (refresh token)
    alt refresh token valid
        BE-->>API: New access token
        API->>API: Save token in sessionStorage
        API->>BE: Retry original request
        BE-->>UI: Response
    else refresh token invalid or missing
        API->>API: Clear tokens
        API-->>UI: Redirect to login.html
    end
```

---

## 🧭 App Flow

```mermaid
flowchart TD
    I[index.html] --> L[Login]
    L -->|no account| R[Register] --> L
    L -->|forgot password| F[Forgot Password<br/>email reset link] --> RP[Reset Password] --> L
    L -->|success| D[Dashboard]
    D <--> PR[Pricing]
    D <--> PF[Profile]
    PF --> CP[Change Password]
    D & PR & PF -->|Logout| L
```

### 🧾 Order handling on the dashboard

```mermaid
flowchart LR
    A[+ New Order] --> B[Fill customer details<br/>add garments + quantity]
    B --> C[POST /order] --> D[Order appears in table<br/>stats update]
    D --> E[Click an order]
    E --> F[View details]
    F --> G[Edit<br/>PATCH]
    F --> H[Mark Delivered<br/>PUT status]
    F --> I[Delete]
```

---

## 🗂️ Project Structure

```
├── index.html              Redirects to login
├── login.html              Login
├── register.html           Create account
├── forgot-password.html    Request reset link
├── reset-password.html     Set new password using the emailed token
├── change-password.html    Change password (logged-in)
├── dashboard.html          Orders + stats
├── pricing.html            Garment price list
├── profile.html            Profile + photo
├── css/                    One stylesheet per page
├── js/
│   ├── api.js              Shared fetch wrapper (token + auto refresh)
│   └── *.js                One script per page
└── images/                 Default profile picture
```

---

## ⚙️ Getting Started

### Prerequisites
A running instance of the [backend](https://github.com/dhruvkhurana1626/laundry-management-backend) (Java 21, MySQL).

### 1. Clone
```bash
git clone https://github.com/dhruvkhurana1626/laundry-management-frontend.git
cd laundry-management-frontend
```

### 2. Point it to your backend
Open `js/api.js` and change the base URL:
```js
const API_BASE_URL = "http://localhost:8080";
```

### 3. Serve it on port 3000
There is no build step. Use any static server:
```bash
python -m http.server 3000
# or use the VS Code "Live Server" extension and set its port to 3000
```
Open **http://localhost:3000**

> ⚠️ The backend only allows requests from `localhost:3000`, `127.0.0.1:3000` and the Vercel domain (CORS). If you serve the app on another port, add it in the backend's `SecurityConfig`.

### 4. Deploy
Push to GitHub and import the repo in **Vercel**. It is a static site, so no build settings are needed.

---

## 🧪 Quick Test Flow

1. Register a new account, then log in.
2. Open **Pricing** and change the price of a garment.
3. On the **Dashboard**, click **+ New Order**, add a customer and a few garments.
4. Open the order, edit it, then mark it as **Delivered**.
5. Open **Profile**, fill in business details and upload a photo.

---

## 🚀 Future Improvements
- Show the monthly revenue and order stats from the backend `/dashboard` API
- Pagination and status / date filters on the orders table
- Move to React for reusable components
- Loading skeletons and toast notifications

---

## 👤 Author

**Dhruv Khurana**
[GitHub](https://github.com/dhruvkhurana1626)
