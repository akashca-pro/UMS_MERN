# User Management Web Application

## Overview

This is a **MERN stack**-based User Management Web Application that provides **CRUD (Create, Read, Update, Delete) operations** for users. The application includes authentication using tokens and manages state using **Redux**. It has two distinct user roles: **User** and **Admin**.

## Features

- **User Authentication** (JWT Token-based authentication)
- **Role-based Access** (Admin & User routes)
- **User Management** (Admin can add, edit, delete, and view users)
- **User Dashboard** (Users can view and manage their profiles)
- **State Management** using **Redux**
- **Secure API Routes** with token verification
- **Responsive UI** built with React & Tailwind CSS

## Tech Stack

### Frontend:

- React (Vite)
- Redux (for state management)
- Tailwind CSS (for styling)

### Backend:

- Node.js
- Express.js
- MongoDB (Mongoose for database operations)
- JWT (JSON Web Token for authentication)
- bcrypt (for password hashing)

## Installation & Setup

### Prerequisites:

- Node.js installed
- MongoDB installed and running

### Clone the repository:

```sh
git clone https://github.com/UMS_MERN/user-management-app.git
cd user-management-app
```

### Backend Setup:

```sh
cd backend
npm install
```

#### Configure Environment Variables:

Create a `.env` file inside the **backend** directory and add:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run the backend server:

```sh
npm start
```

### Frontend Setup:

```sh
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication:

- `POST /login` - Login and receive a token
- `POST /auth/register` - Register a new user

### Admin Routes:

- `GET /admin/dashboard` - View all users
- `POST /admin/add-user` - Add a new user
- `PUT /admin/edit-user/:id` - Edit a user
- `DELETE /admin/delete-user/:id` - Delete a user

### User Routes:

- `GET /user/profile` - View own profile
- `PUT /user/edit-profile` - Edit profile

## Usage

1. **Admin Login**: Log in as an admin to manage users.
2. **User Login**: Log in to view and edit personal details.
3. **CRUD Operations**: Admin can add, update, and delete users.

## Folder Structure

```
user-management-app/
├── backend/
│   ├── models/        # Database models
│   ├── routes/        # Express API routes
│   ├── controllers/   # Business logic
│   ├── middleware/    # Authentication middleware
│   ├── server.js      # Main server file
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store and slices
│   │   ├── App.js       # Main App component
│   │   ├── index.js     # Entry point
│   ├── public/
│
├── README.md
├── package.json
```

## Contributing

1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.

---

**Author: Akash C A**
