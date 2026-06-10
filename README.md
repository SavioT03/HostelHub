# HostelHub

A full-stack web application for listing, discovering, and managing hostel/PG accommodations. Property owners can list and manage their properties; users can browse, save, and contact owners. Admins oversee the platform and approve featured property requests.

---

## Features

- **User auth** — register, login, JWT-based sessions
- **Role-based access** — three roles: `user`, `owner`, `admin`
- **Property listings** — owners can create listings with multi-image galleries (add, reorder, remove)
- **Property detail page** — image gallery, embedded map, contact info (gated to logged-in users)
- **Save / unsave properties** — users can bookmark properties, synced via global context
- **Featured properties** — owners request featured status; admins approve/reject; approved listings appear on the home page
- **Owner dashboard** — manage your own listings
- **Profile page** — shared across owner and user roles
- **Admin panel** — manage users, properties, and featured requests

---

## Tech Stack

**Frontend** — React, Vite, React Router, Context API  
**Backend** — Node.js, Express, MongoDB, Mongoose, JWT  

---

## Project Structure

```
HostelHub/
├── frontend/   # React + Vite app
└── backend/    # Express + MongoDB API
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/hostelhub.git
cd hostelhub
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostelhub
JWT_SECRET=your_jwt_secret_here
```

Start the backend:

```bash
npm start
```

> Runs with nodemon — the server restarts automatically on file changes.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Creating an Admin User

There is no automated seed script. To promote a user to admin:

1. Register a new account through the app as usual.
2. Open **MongoDB Compass** and connect to your database.
3. Navigate to the `users` collection.
4. Find the user you want to promote.
5. Edit the document and change the `role` field from `"user"` to `"admin"`.
6. Save — the user now has full admin access.

---

## Environment Variables Summary

| Variable | Location | Description |
|---|---|---|
| `PORT` | backend `.env` | Port for the Express server (default 5000) |
| `MONGO_URI` | backend `.env` | MongoDB connection string |
| `JWT_SECRET` | backend `.env` | Secret key for signing JWTs |
| `VITE_API_URL` | frontend `.env` | Base URL of the backend API |

---

## Scripts

| Command | Directory | Description |
|---|---|---|
| `npm start` | `backend/` | Start backend with nodemon |
| `npm run dev` | `frontend/` | Start frontend dev server (Vite) |

---

## License

This project was built as a personal project.
