# MERN Stack Authentication System - Implementation Guide

## Overview
This guide details the unified authentication system implemented for the College Management System. The system now uses a single User model and authentication flow for all roles (Admin, Faculty, Student).

## What Changed

### Backend Changes

#### 1. **New User Model** (`backend/models/user.model.js`)
- Single unified user model for all roles
- Fields: name, email, password (hashed), role, resetPasswordToken, resetPasswordExpire, isActive
- Password hashing using bcryptjs
- Role-based authorization (admin, faculty, student)
- Methods: `matchPassword()`, `getResetPasswordToken()`

#### 2. **Auth Controller** (`backend/controllers/auth.controller.js`)
- `registerController` - Register new users
- `loginController` - Unified login for all roles
- `forgotPasswordController` - Generate password reset token and send email
- `resetPasswordController` - Reset password with valid token
- `getMeController` - Get current authenticated user

#### 3. **Auth Routes** (`backend/routes/auth.route.js`)
```
POST   /api/auth/register          - Register user
POST   /api/auth/login             - Login user
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password with token
GET    /api/auth/me                - Get current user (protected)
```

#### 4. **Updated Auth Middleware** (`backend/middlewares/auth.middleware.js`)
- `protect` - Verify JWT token and attach user to request
- `authorize` - Check role-based access control (optional roles)
- Backward compatible `auth` export for existing code

#### 5. **Updated Backend Entry Point** (`backend/index.js`)
- Added auth routes: `app.use("/api/auth", require("./routes/auth.route"));`
- All routes properly organized

### Frontend Changes

#### 1. **Updated Login Component** (`frontend/src/Screens/Auth/Login.jsx`)
- Now calls `/api/auth/login` instead of role-specific endpoints
- Uses unified API response structure
- Stores user info: token, role, userId, userName
- Redirects based on role returned from API

#### 2. **New Register Component** (`frontend/src/Screens/Auth/Register.jsx`)
- Full working registration form
- Fields: name, email, password, confirmPassword, role
- Calls `/api/auth/register`
- Automatic login on successful registration
- Form validation (name, email, password strength)

#### 3. **New Forgot Password Component** (`frontend/src/Screens/Auth/ForgotPassword.jsx`)
- Clean UI for password reset request
- Calls `/api/auth/forgot-password`
- Shows confirmation message after email sent
- Link in email points to reset-password page

#### 4. **New Reset Password Component** (`frontend/src/Screens/Auth/ResetPassword.jsx`)
- Accepts token and email from URL query parameters
- Calls `/api/auth/reset-password`
- Validates passwords and confirms they match
- Automatically logs in user after successful reset

## Setup Instructions

### Step 1: Backend Configuration

1. **Update .env file** (`backend/.env`):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/College
PORT=4000
FRONTEND_API_LINK=http://localhost:3000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASS=your_app_password
NODE_ENV=development
```

2. **Install dependencies** (if not already installed):
```bash
cd backend
npm install
```

3. **Start MongoDB** (if not running):
```bash
# Windows
mongod

# Or use MongoDB Compass/Atlas
```

### Step 2: Frontend Configuration

1. **No configuration needed** - Frontend is already set up to call `/api/auth/*` endpoints

2. **Ensure environment variables** in `frontend/.env`:
```env
VITE_API_URL=http://localhost:4000/api
VITE_MEDIA_URL=http://localhost:4000/media
```

## API Endpoints

### Public Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // "admin", "faculty", or "student"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGc..."
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGc..."
  }
}
```

#### Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "message": "If email exists, reset link will be sent",
  "data": null
}
```

#### Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "token": "reset_token_from_email",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}

Response:
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

### Protected Endpoints

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "User retrieved",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    ...
  }
}
```

## User Flows

### Registration Flow
1. User visits `/register`
2. Fills form with name, email, password, and selects role
3. Submits to `/api/auth/register`
4. On success:
   - Token and user info stored in localStorage
   - Redux state updated with token
   - User redirected to dashboard (`/student`, `/faculty`, or `/admin`)

### Login Flow
1. User visits `/login`
2. Selects role (Student, Faculty, or Admin)
3. Enters email and password
4. Old system: Used role-specific endpoints (e.g., `/student/login`)
5. **New system**: Uses unified `/api/auth/login` endpoint
6. Backend returns user role and redirects accordingly

### Forgot Password Flow
1. User clicks "Forgot Password?" on login page
2. Navigates to `/forgot-password`
3. Enters email address
4. Backend sends reset email with link: `/reset-password?token=xxx&email=xxx`
5. User clicks link in email
6. Enters new password on reset page
7. Successfully resets password and logs in automatically

## localStorage Structure

After login/registration, the following is stored:
```javascript
localStorage.setItem("userToken", token);                    // JWT token
localStorage.setItem("userType", "Student");                // Role (capitalized)
localStorage.setItem("userId", user.id);                    // User ID
localStorage.setItem("userName", user.name);                // User name
```

## Password Reset Token

- Reset token valid for **10 minutes**
- Token is hashed before storing in database
- Email contains link with original token (not hashed)
- Used to reset password and validate user

## Error Handling

All API responses follow this structure:
```javascript
{
  success: boolean,
  message: string,
  data: any | null
}
```

HTTP Status Codes:
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 409 - Conflict (email already exists)
- 500 - Server Error

## Database Migration

### Before (Separate Models)
- `studentDetails` model
- `facultyDetails` model
- `adminDetails` model (if existed)

### After (Unified Model)
- `User` model - stores all authentication data

### Migration Steps (Optional)
If you want to migrate existing data:
1. Extract credentials from old models
2. Create User documents
3. Update foreign keys in other collections to reference User._id
4. Deprecate old models

**Note**: You can run both systems in parallel initially by keeping both login mechanisms.

## Testing the System

### Test Register
1. Go to http://localhost:3000/register
2. Fill in form:
   - Name: Test Student
   - Email: test@example.com
   - Password: testpass123
   - Role: Student
3. Click "Create Account"
4. Should redirect to `/student` dashboard

### Test Login
1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: test@example.com
   - Password: testpass123
3. Role should be auto-selected based on account
4. Click Sign In
5. Should redirect to correct dashboard

### Test Forgot Password
1. Go to http://localhost:3000/forgot-password
2. Enter email: test@example.com
3. Check console logs (email won't actually send without SMTP setup)
4. Should see success message

### Test Protected Routes
1. Clear localStorage
2. Try to access http://localhost:3000/student
3. Should redirect to login

## Common Issues & Solutions

### Issue: "Email already registered"
**Solution**: Use a different email address or delete the user from MongoDB

### Issue: Login button not working
**Solution**: 
- Check browser console for errors
- Verify backend is running on port 4000
- Check network tab to see API response
- Ensure JWT_SECRET is set in .env

### Issue: Email not sending
**Solution**:
- Update NODEMAILER_EMAIL and NODEMAILER_PASS in .env
- For Gmail, use App Password (not regular password)
- Ensure "Less secure app access" is enabled (Gmail)

### Issue: Token expired error
**Solution**:
- Clear localStorage and login again
- Default token expiry is 7 days
- To change: Update JWT_EXPIRE in .env

## Next Steps

1. **Integrate with Existing Routes**: Update other controllers to use the new User model
2. **Admin Controls**: Create endpoints for admin to create/manage users
3. **Role-Based Permissions**: Implement full role-based access control
4. **Email Template**: Customize password reset email template
5. **2FA**: Add two-factor authentication for admin
6. **Session Management**: Implement logout functionality
7. **Refresh Tokens**: Add refresh token mechanism for better security

## Files Modified/Created

### Backend
- ✅ Created: `backend/models/user.model.js`
- ✅ Created: `backend/controllers/auth.controller.js`
- ✅ Created: `backend/routes/auth.route.js`
- ✅ Modified: `backend/middlewares/auth.middleware.js`
- ✅ Modified: `backend/app.js`
- ✅ Modified: `backend/index.js`

### Frontend
- ✅ Modified: `frontend/src/Screens/Auth/Login.jsx`
- ✅ Modified: `frontend/src/Screens/Auth/Register.jsx`
- ✅ Modified: `frontend/src/Screens/Auth/ForgotPassword.jsx`
- ✅ Modified: `frontend/src/Screens/Auth/ResetPassword.jsx`

## Environment Variables Required

### Backend (.env)
```
MONGODB_URI
PORT
FRONTEND_API_LINK
FRONTEND_URL
JWT_SECRET
JWT_EXPIRE
NODEMAILER_EMAIL
NODEMAILER_PASS
NODE_ENV
```

### Frontend (.env)
```
VITE_API_URL
VITE_MEDIA_URL
```

---

**Implementation Date**: March 31, 2026
**Status**: ✅ Complete - Ready for Testing
