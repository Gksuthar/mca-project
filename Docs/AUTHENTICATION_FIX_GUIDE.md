# College Management System - Authentication System Fix Guide

## Overview
This document outlines all the authentication system improvements made to your MERN stack college management system.

---

## ✅ What Was Fixed

### 1. **Unified Authentication System**
- ✅ Replaced role-based login routes with single `/api/auth/login` endpoint
- ✅ Removed `/student/login`, `/faculty/login` routes
- ✅ Created centralized User model for all authentication
- ✅ Added JWT-based authentication

### 2. **Backend Changes**

#### New Files Created:
1. **[backend/models/user.model.js](backend/models/user.model.js)**
   - Unified user model for all roles (student, faculty, admin)
   - Password hashing using bcrypt
   - JWT token generation
   - Password reset token functionality

2. **[backend/controllers/auth.controller.js](backend/controllers/auth.controller.js)**
   - `register()` - User registration with role selection
   - `login()` - Unified login for all users
   - `forgotPassword()` - Generate reset token and send email
   - `resetPassword()` - Reset password using token
   - `getMe()` - Get current user info
   - `logout()` - Logout functionality

3. **[backend/middlewares/jwt.middleware.js](backend/middlewares/jwt.middleware.js)**
   - `protect` - Verify JWT token
   - `authorize` - Check user role permissions

4. **[backend/routes/auth.route.js](backend/routes/auth.route.js)**
   - POST `/api/auth/register` - Register new user
   - POST `/api/auth/login` - Login user
   - POST `/api/auth/forgot-password` - Request password reset
   - POST `/api/auth/reset-password` - Reset password
   - GET `/api/auth/me` - Get current user (protected)
   - POST `/api/auth/logout` - Logout (protected)

#### Updated Files:
1. **[backend/seeder.js](backend/seeder.js)**
   - Now creates User documents alongside existing detail models
   - Seeded users: admin@college.com, rajesh@college.com, priya@college.com, vikram@college.com, and 8 students

2. **[backend/auto-seeder.js](backend/auto-seeder.js)**
   - Auto-seeds User collection on first run
   - Creates authentication records for all roles

### 3. **Frontend Changes**

#### New Files Created:
1. **[frontend/src/Screens/Auth/Login.jsx](frontend/src/Screens/Auth/Login.jsx)**
   - Updated to call `/api/auth/login`
   - Removed role selector dependency
   - Stores JWT token in localStorage
   - Redirects based on user.role from API response

2. **[frontend/src/Screens/Auth/Register.jsx](frontend/src/Screens/Auth/Register.jsx)**
   - New registration component with role selection
   - Calls `/api/auth/register`
   - Stores JWT and user info
   - Redirects to role-specific dashboard

3. **[frontend/src/Screens/Auth/ForgotPassword.jsx](frontend/src/Screens/Auth/ForgotPassword.jsx)**
   - Request password reset with email
   - Calls `/api/auth/forgot-password`

4. **[frontend/src/Screens/Auth/ResetPassword.jsx](frontend/src/Screens/Auth/ResetPassword.jsx)**
   - Reset password with token from email
   - Calls `/api/auth/reset-password`
   - Auto-login after successful reset

5. **[frontend/src/components/ProtectedRoute.jsx](frontend/src/components/ProtectedRoute.jsx)**
   - Protects routes requiring authentication
   - Checks for userToken in localStorage

#### Updated Files:
- **[frontend/src/App.jsx](frontend/src/App.jsx)** - Updated import paths to new Auth folder

---

## 🔐 API Endpoints

### Authentication Endpoints

#### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "student"  // student, faculty, admin
}

Response:
{
  "statusCode": 201,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  },
  "message": "User registered successfully",
  "success": true
}
```

#### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  },
  "message": "Login successful",
  "success": true
}
```

#### 3. Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response:
{
  "statusCode": 200,
  "data": {
    "message": "Password reset link sent to your email"
  },
  "message": "Email sent successfully",
  "success": true
}
```

#### 4. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}

Response:
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  },
  "message": "Password reset successfully",
  "success": true
}
```

#### 5. Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "User retrieved successfully",
  "success": true
}
```

---

## 🧪 Testing Credentials

### Default Users Created:

#### Admin
- Email: `admin@college.com`
- Password: `admin123`
- Role: `admin`

#### Faculty Members
- Email: `rajesh@college.com` | Password: `faculty123`
- Email: `priya@college.com` | Password: `faculty123`
- Email: `vikram@college.com` | Password: `faculty123`

#### Students
- Email: `rahul@student.com` | Password: `student123`
- Email: `sneha@student.com` | Password: `student123`
- Email: `amit@student.com` | Password: `student123`
- Email: `ananya@student.com` | Password: `student123`
- Email: `karan@student.com` | Password: `student123`
- Email: `divya@student.com` | Password: `student123`
- Email: `arjun@student.com` | Password: `student123`
- Email: `kavya@student.com` | Password: `student123`

---

## 🚀 How to Run

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Run auto-seeder (creates database with default users)
npm start

# In another terminal, if you want to manually seed:
npm run seed
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Variables Required

Create `.env` file in backend directory:
```
MONGODB_URI=mongodb://localhost:27017/college_management
MONGODB_URL=mongodb://localhost:27017/college_management
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🔄 Frontend Authentication Flow

### 1. **Login Flow**
```
User enters email & password
    ↓
POST /api/auth/login
    ↓
Receive token & user data
    ↓
Store in localStorage:
  - userToken: JWT token
  - userType: User role (Student/Faculty/Admin)
  - userId: User ID
  - userName: User name
    ↓
dispatch(setUserToken(token))
    ↓
Navigate to /${role} dashboard
```

### 2. **Register Flow**
```
User fills registration form
    ↓
POST /api/auth/register
    ↓
Receive token & user data
    ↓
Store authentication data
    ↓
Navigate to role-specific dashboard
```

### 3. **Forgot Password Flow**
```
User enters email
    ↓
POST /api/auth/forgot-password
    ↓
Email sent with reset link
    ↓
User clicks link & goes to /reset-password?token=xxx
    ↓
Enters new password
    ↓
POST /api/auth/reset-password
    ↓
Auto-login with new credentials
```

### 4. **Protected Routes**
```
ProtectedRoute component checks:
  - Is userToken in localStorage?
  - Is userType in localStorage?
    
If both exist → Allow access
If not → Redirect to /login
```

---

## 📁 File Structure Summary

```
backend/
├── models/
│   ├── user.model.js (NEW)
│   └── details/
│       ├── admin-details.model.js
│       ├── faculty-details.model.js
│       └── student-details.model.js
├── controllers/
│   ├── auth.controller.js (NEW)
│   └── [other controllers]
├── middlewares/
│   ├── jwt.middleware.js (NEW)
│   └── auth.middleware.js
├── routes/
│   ├── auth.route.js (NEW)
│   └── [other routes]
├── seeder.js (UPDATED)
└── auto-seeder.js (UPDATED)

frontend/
├── src/
│   ├── Screens/
│   │   ├── Auth/ (NEW FOLDER)
│   │   │   ├── Login.jsx (NEW)
│   │   │   ├── Register.jsx (NEW)
│   │   │   ├── ForgotPassword.jsx (NEW)
│   │   │   └── ResetPassword.jsx (NEW)
│   │   └── [other screens]
│   ├── components/
│   │   └── ProtectedRoute.jsx (NEW)
│   ├── redux/
│   └── App.jsx (UPDATED)
```

---

## 🐛 Debugging Tips

### 1. Check Backend Logs
```bash
# Terminal should show:
Connected to MongoDB Successfully
Server Listening On http://localhost:4000
```

### 2. Test API Endpoints
Use Postman or VS Code REST Client:
```http
### Login
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@college.com",
  "password": "admin123"
}
```

### 3. Check LocalStorage
Open browser DevTools → Application → Local Storage
Should contain:
- `userToken` - JWT token
- `userType` - User's role
- `userId` - User's ID
- `userName` - User's name

### 4. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Email not found" on login | Check seeder ran successfully: `npm run seed` |
| "Invalid credentials" | Verify email and password are correct |
| "Token expired" | Clear localStorage and login again |
| CORS errors | Ensure backend is running on port 4000 |
| Routes not found | Make sure new Auth folder files exist in frontend/src/Screens/ |

---

## 🔒 Security Features

✅ **Password Security**
- Passwords hashed using bcrypt (10 salt rounds)
- Passwords never stored in plain text
- Password field excluded from queries by default

✅ **JWT Authentication**
- Tokens expire in 7 days (configurable)
- Tokens include user ID and role
- All protected routes verify tokens

✅ **Password Reset Security**
- Reset tokens hash-encrypted
- Tokens expire in 30 minutes
- One-time use only

✅ **Role-based Access**
- `authorize` middleware enforces role permissions
- Users can only access their own data
- Admin has full system access

---

## 📝 Next Steps

1. **Setup Environment Variables** - Create `.env` file with MongoDB URI and JWT secret
2. **Run Seeder** - Create default users: `npm run seed`
3. **Start Backend** - `npm start`
4. **Start Frontend** - `npm start` in frontend folder
5. **Test Login** - Use default credentials (see Testing Credentials section)
6. **Customize** - Update emails, validation rules, UI as needed

---

## 📞 Support

If you encounter any issues:
1. Check the backend console for errors
2. Open browser DevTools to see network requests
3. Verify MongoDB connection
4. Ensure all files are in correct locations
5. Clear browser cache and localStorage

