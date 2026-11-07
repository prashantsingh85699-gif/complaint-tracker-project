# Complaint Tracker

A full-stack web application designed for college or hostel environments where students can log complaints and administrators can review, filter, and resolve them.

## Features

- Role-based access control with two roles: user and admin.
- Users can register, log in, lodge complaints (water, electricity, wifi, cleaning), and track status.
- Users can delete their own complaints only if the status is still "open".
- Admins can view all complaints, filter by status, category, and priority, and navigate with pagination.
- Admins can update complaint status (open -> in-progress -> resolved).
- Security measures against privilege escalation, NoSQL injection, and unauthorized deletion.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB with Mongoose, JSON Web Tokens (jsonwebtoken), bcryptjs, cors, dotenv.
- Frontend: React (Vite), React Router v6, Axios, Context API, Plain CSS.

## Folder Structure

```
complaint-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── complaintController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Complaint.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── complaintRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── utils/
│   │   │   └── axios.js
│   │   ├── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Environment Variables

### Backend (`backend/.env`)

- `PORT` - Port number the backend server runs on (e.g., 5000).
- `MONGO_URI` - MongoDB connection string (local or MongoDB Atlas).
- `JWT_SECRET` - Secret key used for signing JSON Web Tokens.
- `CLIENT_URL` - Comma-separated list of allowed frontend origins for CORS.

### Frontend (`frontend/.env`)

- `VITE_API_URL` - Base URL of the backend API (e.g., http://localhost:5000 or production backend URL).

## How to Run Locally

### 1. Backend Setup

```bash
cd backend
npm install
# Create .env based on .env.example
npm run dev    # For development with nodemon
# or
npm start      # For standard node execution
```

The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
# Create .env based on .env.example
npm run dev
```

The frontend application runs on `http://localhost:5173`.

## API Routes

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | Public | Health check endpoint |
| POST | `/api/auth/` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in user and receive JWT |
| POST | `/api/complaints` | Protected (User) | Create a new complaint |
| GET | `/api/complaints/my` | Protected (User) | Get complaints created by logged-in user |
| GET | `/api/complaints` | Protected (Admin) | Get all complaints with filters and pagination |
| PATCH | `/api/complaints/:id/status` | Protected (Admin) | Update complaint status |
| DELETE | `/api/complaints/:id` | Protected (User) | Delete own complaint (open status only) |

## Live Deployment

- Frontend (Vercel): [PLACEHOLDER_FRONTEND_URL]
- Backend (Render): [PLACEHOLDER_BACKEND_URL]

## What I Learned

- Designing role-based access control with custom Express middleware using JavaScript closures.
- Securing registration endpoints against privilege escalation by whitelisting fields.
- Sanitizing incoming query parameters to prevent NoSQL operator injection in MongoDB queries.
- Managing client-side session state and automated 401 handling using Axios request and response interceptors.
- Configuring production CORS allow-lists and handling SPA client routing on hosting platforms using rewrite rules.

