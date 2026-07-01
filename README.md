# BuyNest — Premium Full-Stack MERN E-Commerce Platform

BuyNest is a premium, high-end e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). It offers a complete shopping experience, from dynamic catalog filtering and wishlists to secure checkout powered by Stripe Test Mode. It also features a real-time admin dashboard for complete store management.

---

## 🚀 Key Features

*   **Secure Authentication**: Role-based access control (User & Admin) with automated JWT token rotation (Access Token in-memory, HTTP-Only Refresh Token cookies).
*   **Interactive Catalog**: Search, sort, paginate, and filter products dynamically by categories, price range, and stock status.
*   **Robust State Management**: Shopping cart synced to local storage, database-persisted wishlist, and global user auth context.
*   **Seamless Checkout**: Fully integrated Stripe elements payment form (Test Mode) with inventory stock updates and transaction records.
*   **Admin Dashboard**: Rich analytics for sales, revenue charts by category, user account role configurations, and full CRUD tables to manage products/categories.
*   **Media Management**: Directly streams product uploads to Cloudinary storage via Multer.
*   **Design & UX**: Responsive layout styled with Tailwind CSS, premium HSL color palettes, custom loaders, and micro-animations.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React, Vite, React Router, Tailwind CSS, TanStack Query, React Hook Form, Zod |
| **Backend** | Node.js, Express.js, Mongoose, JWT, bcryptjs, express-validator |
| **Database** | MongoDB Atlas |
| **Integrations** | Stripe API (Test Mode), Cloudinary (Image Hosting) |

---

## 📦 Project Structure

```text
ecommerce/
├── client/     # Frontend Vite React App
└── server/     # Backend Node.js API Service
```

---

## 🔧 Installation & Local Setup

### Prerequisites
*   Node.js installed
*   MongoDB Atlas account
*   Stripe Account (Test API keys)
*   Cloudinary Account

### 1. Clone the repository and install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
ACCESS_TOKEN_SECRET=your_jwt_access_secret_key
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

### 3. Run the Development Servers
In two separate terminals, launch the services:

```bash
# Start backend api (port 5000)
cd server
npm run dev

# Start frontend client (port 5173)
cd client
npm run dev
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
