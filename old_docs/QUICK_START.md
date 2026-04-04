# Quick Start Guide - MERN College Management System

## Prerequisites
- Node.js (v14+) installed
- MongoDB running locally or MongoDB Atlas connection string
- npm or yarn package manager

## Installation & Setup

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd backend

# Install dependencies (if not already done)
npm install

# Start backend server
npm run dev
# Or: npm start (for production)
```

**Expected Output:**
```
Connected to MongoDB Successfully
Server Listening On http://localhost:4000
Auto-seeding completed...
```

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start frontend development server
npm start
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### 3. Access the Application

Open browser and go to: **http://localhost:3000**

You should see the login page with role selection (Student, Faculty, Admin).

---

## First-Time Testing

### Test 1: Register a New Student

1. Click "Sign Up" link on login page
2. Fill registration form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: Test@123
   - **Role**: Student
3. Click "Create Account"
4. ✅ Should redirect to student dashboard

### Test 2: Login with New Account

1. Go to login page (`/login`)
2. Email: john@example.com
3. Password: Test@123
4. ✅ Should see dashboard

### Test 3: Forgot Password

1. Click "Forgot Password?" on login
2. Enter email: john@example.com
3. ✅ Should see confirmation message
4. **Note**: Email won't send without SMTP setup (check console for token)

### Test 4: Protected Routes

1. Open browser DevTools > Application > Local Storage
2. Delete all items (clear tokens)
3. Try to access http://localhost:3000/student directly
4. ✅ Should redirect to login

---

## Backend API Testing

### Using cURL or Postman

#### 1. Register User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "jane@123",
    "role": "faculty"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "jane@123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "faculty"
    },
    "token": "eyJhbGc..."
  }
}
```

#### 3. Get Current User (Protected)
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Forgot Password
```bash
curl -X POST http://localhost:4000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com"
  }'
```

---

## Troubleshooting

### Backend Issues

**❌ "Cannot find module 'bcryptjs'"**
```bash
cd backend
npm install bcryptjs jsonwebtoken nodemailer
```

**❌ "MongoDB connection failed"**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- For MongoDB Atlas: use connection string from your cluster

**❌ "Port 4000 already in use"**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4000
kill -9 <PID>
```

### Frontend Issues

**❌ "CORS error"**
- Ensure FRONTEND_API_LINK in backend .env matches frontend origin
- Should be: `http://localhost:3000`

**❌ "API 404 errors"**
- Verify backend routes in `backend/index.js`
- Check routing paths match exactly
- Restart backend server

**❌ "Blank login page"**
- Check browser DevTools for JavaScript errors
- Verify axios baseUrl in `frontend/src/utils/AxiosWrapper.js`
- Clear browser cache and reload

---

## Project Structure

```
mca-project/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js          (NEW)
│   │   └── details/
│   ├── models/
│   │   ├── user.model.js               (NEW)
│   │   └── details/
│   ├── routes/
│   │   ├── auth.route.js               (NEW)
│   │   └── details/
│   ├── middlewares/
│   │   └── auth.middleware.js          (UPDATED)
│   ├── .env                             (CONFIGURE)
│   ├── app.js                          (UPDATED)
│   └── index.js                        (UPDATED)
│
├── frontend/
│   └── src/
│       └── Screens/
│           ├── Auth/
│           │   ├── Login.jsx           (UPDATED)
│           │   ├── Register.jsx        (UPDATED)
│           │   ├── ForgotPassword.jsx  (UPDATED)
│           │   └── ResetPassword.jsx   (UPDATED)
│           └── ...
│
└── AUTHENTICATION_SYSTEM_GUIDE.md      (NEW)
```

---

## Environment Configuration

### Backend .env (backend/.env)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/College
PORT=4000
FRONTEND_API_LINK=http://localhost:3000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRE=7d
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASS=your_app_specific_password
NODE_ENV=development
```

### Frontend .env (Already configured)
- `baseUrl.js` automatically uses:
  - API: `http://localhost:4000/api`
  - Media: `http://localhost:4000/media`

---

## Key Features Implemented

✅ **Unified Authentication**
- Single User model for all roles
- Unified /api/auth endpoints
- JWT token-based authentication

✅ **User Registration**
- Create account with email/password
- Role selection (Student, Faculty, Admin)
- Email validation
- Password strength validation

✅ **User Login**
- Login with email and password
- Role-based redirect
- Token stored in localStorage
- Secure password verification

✅ **Password Reset**
- Send reset link via email
- Token-based validation
- Secure password update
- Auto-login after reset

✅ **Protected Routes**
- JWT middleware verification
- Role-based access control
- Automatic redirect to login if unauthorized

---

## Default Test Credentials

Use these if you've run the seeder:

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@example.com | admin@123 |
| Faculty | faculty@example.com | faculty@123 |
| Student | student@example.com | student@123 |

**To seed default users** (if seeder exists):
```bash
cd backend
npm run seed:admin    # Seed admin user
npm run seed          # Seed all default users
```

---

## Development Workflow

### Making API Changes
1. Edit controller in `backend/controllers/auth.controller.js`
2. Restart backend server (npm automatically restarts with nodemon)
3. Test with frontend or cURL

### Making UI Changes
1. Edit React component in `frontend/src/Screens/Auth/`
2. Frontend auto-refreshes (Vite hot module reload)
3. Test in browser

### Adding New Features
1. Define route in `backend/routes/auth.route.js`
2. Create controller method
3. Create frontend component/hook
4. Test end-to-end

---

## Next Steps for Production

1. **Environment Security**
   - Change JWT_SECRET to strong random string
   - Use environment-specific configs
   - Never commit .env file

2. **Email Configuration**
   - Set up Gmail App Password or SendGrid
   - Create email templates
   - Test email delivery

3. **Database**
   - Connect to MongoDB Atlas (cloud)
   - Set up database backups
   - Create indexes on User model

4. **HTTPS**
   - Enable HTTPS on both frontend and backend
   - Update CORS origins to use https://

5. **Rate Limiting**
   - Add rate limiter to login endpoint
   - Prevent brute force attacks

6. **Logging**
   - Set up logging service
   - Monitor failed login attempts
   - Track API usage

---

## Support

For issues or questions:
1. Check `AUTHENTICATION_SYSTEM_GUIDE.md` for detailed documentation
2. Review console logs for error messages
3. Check network tab in DevTools for API responses
4. Verify all environment variables are set correctly

---

**Last Updated**: March 31, 2026
**Status**: ✅ Ready for Testing
