# 🚀 Quick Start - Authentication System

## Setup in 5 Minutes

### Step 1: Backend Configuration
```bash
cd backend

# Create .env file (if not exists)
# Add your MongoDB URI:
# MONGODB_URI=mongodb://localhost:27017/college_management
# JWT_SECRET=your_secret_key

# Install dependencies (if needed)
npm install

# Run seeder to create default users
npm run seed

# Start server
npm start
# Expected output:
# Connected to MongoDB Successfully
# Server Listening On http://localhost:4000
```

### Step 2: Frontend Setup
```bash
cd frontend

# Install dependencies (if needed)
npm install

# Start development server
npm start
# App opens at http://localhost:3000
```

### Step 3: Login & Test

#### Use any of these credentials:

**Admin:**
```
Email: admin@college.com
Password: admin123
```

**Faculty:**
```
Email: rajesh@college.com
Password: faculty123
```

**Student:**
```
Email: rahul@student.com
Password: student123
```

---

## 📋 What's New

| Feature | Before | After |
|---------|--------|-------|
| Login Routes | `/student/login`, `/faculty/login` | Single `/api/auth/login` |
| Auth System | No unified system | Unified JWT-based system |
| Database | No User model | New User model for all roles |
| Password Reset | Manual only | Email-based with tokens |
| Registration | Dummy form | Real registration with validation |
| Dashboard Redirect | Manual routes | Automatic role-based redirect |

---

## 🔄 API Quick Reference

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@college.com",
    "password": "admin123"
  }'
```

### Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "student"
  }'
```

### Forgot Password
```bash
curl -X POST http://localhost:4000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

---

## 🧪 Testing Checklist

- [ ] Backend starts without errors
- [ ] Login with admin credentials works
- [ ] Redirects to `/admin` dashboard
- [ ] Login with student credentials works
- [ ] Redirects to `/student` dashboard
- [ ] Register new user works
- [ ] JWT token stored in localStorage
- [ ] Logout clears localStorage
- [ ] Protected routes require login
- [ ] Forgot password sends email (if configured)

---

## 📂 New Files Created

**Backend:**
- `models/user.model.js` - User schema with JWT
- `controllers/auth.controller.js` - Auth logic
- `middlewares/jwt.middleware.js` - JWT verification
- `routes/auth.route.js` - Auth endpoints

**Frontend:**
- `src/Screens/Auth/Login.jsx` - Updated login
- `src/Screens/Auth/Register.jsx` - New registration
- `src/Screens/Auth/ForgotPassword.jsx` - Password reset request
- `src/Screens/Auth/ResetPassword.jsx` - Password reset form
- `src/components/ProtectedRoute.jsx` - Route protection

---

## ⚙️ Configuration

### Backend `.env`
```
MONGODB_URI=mongodb://localhost:27017/college_management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
PORT=4000
```

### Frontend API Base URL
Already configured in `src/baseUrl.js` or axios wrapper to:
```
http://localhost:4000/api
```

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
# Check port 4000 is available
# Check all dependencies are installed
npm install
```

### Frontend shows "Login failed"
```
1. Check backend is running (http://localhost:4000)
2. Check CORS settings in backend
3. Check API endpoints in browser DevTools
4. Verify MongoDB has seeded users
```

### Token issues
```
1. Clear browser localStorage
2. Clear browser cache
3. Login again
4. Check token in browser DevTools
```

---

## ✅ Implementation Complete

Your authentication system now features:
- ✅ Unified login/register system
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Password reset via email
- ✅ Role-based redirects
- ✅ Protected routes
- ✅ MongoDB persistence
- ✅ Default test users

Ready to deploy! 🎉

