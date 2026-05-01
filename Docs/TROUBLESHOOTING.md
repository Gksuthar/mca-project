# 🛠️ Troubleshooting Guide

## Common Issues & Solutions

---

## Backend Issues

### ❌ "Server won't start"

**Symptoms:**
```
Port 4000 already in use
or
Connection refused
or
No output after npm start
```

**Solutions:**

1. **Check if port 4000 is in use:**
```bash
# Windows
netstat -ano | findstr :4000

# Mac/Linux
lsof -i :4000
```

2. **Kill process using port 4000:**
```bash
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

3. **Use different port:**
```javascript
// In index.js
const port = process.env.PORT || 5000;  // Changed from 4000
```

---

### ❌ "Connected to MongoDB but can't seed"

**Symptoms:**
```
Connected to MongoDB Successfully
But npm run seed hangs
or
throws error: E11000 duplicate key error
```

**Solutions:**

1. **Check if collection already exists:**
```bash
# Terminal in backend folder
mongosh college_management
db.users.deleteMany({})  # Clear users
npm run seed
```

2. **Clear all collections:**
```bash
db.dropDatabase()
npm run seed
```

3. **Check .env file:**
```
MONGODB_URI=mongodb://localhost:27017/college_management
```

---

### ❌ "Module not found errors"

**Symptoms:**
```
Error: Cannot find module 'jsonwebtoken'
or
Cannot find module 'bcryptjs'
or
Cannot find module './models/user.model'
```

**Solutions:**

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Check if user.model.js exists:**
```bash
ls models/
# Should show: user.model.js
```

3. **Verify file paths in imports:**
```javascript
// Should be exactly:
const User = require("./models/user.model");
const { protect, authorize } = require("./middlewares/jwt.middleware");
const authRoutes = require("./routes/auth.route");
```

---

### ❌ "JWT token issues"

**Symptoms:**
```
Error: jsonwebtoken malformed
or
Error: invalid token
or
Token always expires immediately
```

**Solutions:**

1. **Check JWT_SECRET in .env:**
```
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

2. **Verify token generation:**
```javascript
// In user.model.js pre-save hook
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);

// In getSignedJwtToken method
return jwt.sign(
  { id: this._id, role: this.role },
  process.env.JWT_SECRET || "your_secret_key",
  { expiresIn: process.env.JWT_EXPIRE || "7d" }
);
```

3. **Test token manually:**
```bash
# Terminal
node
> const jwt = require('jsonwebtoken')
> const token = jwt.sign({id: '123'}, 'secret')
> jwt.verify(token, 'secret')
```

---

### ❌ "Bcrypt hash mismatch"

**Symptoms:**
```
Login fails with correct password
Error: Hash comparison failed
"Invalid credentials" always shown
```

**Solutions:**

1. **Clear password field from queries:**
```javascript
// In auth.controller.js
const user = await User.findOne({ email }).select("+password");
// The +password is important!
```

2. **Verify hashing in seeder:**
```javascript
// Should hash with salt:
const hashedPassword = await bcrypt.hash("admin123", 10);
// Not just storing plain text
```

3. **Check matchPassword method:**
```javascript
// In user.model.js
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

---

## Frontend Issues

### ❌ "Login button does nothing"

**Symptoms:**
```
Click login → nothing happens
No error in console
```

**Solutions:**

1. **Check if backend is running:**
```bash
# Terminal
curl http://localhost:4000
# Should show: Hello 👋 I am Working Fine 🚀
```

2. **Verify API endpoint in baseUrl.js:**
```javascript
// frontend/src/baseUrl.js
const baseUrl = "http://localhost:4000/api";
```

3. **Check browser console for errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red error messages

4. **Verify form data is being sent:**
```javascript
// In Login.jsx handleSubmit
console.log("Form data:", formData);
console.log("Sending to:", "/api/auth/login");
```

---

### ❌ "Login fails: 'Cannot POST /api/auth/login'"

**Symptoms:**
```
404 error
POST http://localhost:4000/api/auth/login 404
```

**Solutions:**

1. **Verify auth routes are registered in index.js:**
```javascript
// backend/index.js
app.use("/api/auth", require("./routes/auth.route"));
```

2. **Check auth.route.js exists:**
```bash
backend/routes/auth.route.js
# Should exist and export router
```

3. **Restart backend:**
```bash
# Kill and restart
npm start
```

---

### ❌ "Login succeeds but doesn't redirect"

**Symptoms:**
```
Login works
Gets token
But stays on login page
or
"Cannot read property 'role' of undefined"
```

**Solutions:**

1. **Check response format:**
```javascript
// Expected format:
{
  data: {
    token: "jwt_token",
    user: {
      id: "user_id",
      role: "admin"  // This is important!
    }
  }
}
```

2. **Verify user data is returned from backend:**
```javascript
// In auth.controller.js login
return res.status(200).json(
  ApiResponse.success({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role  // Ensure role is included
    }
  }, "Login successful")
);
```

3. **Check localStorage after login:**
```javascript
// Open DevTools → Application → Local Storage
// Should show: userToken, userType, userId, userName
```

---

### ❌ "Route not found: '/register' or '/forgot-password'"

**Symptoms:**
```
Clicking register → 404
Path `/register` not found
```

**Solutions:**

1. **Verify new Auth folder exists:**
```bash
frontend/src/Screens/Auth/
# Should contain: Login.jsx, Register.jsx, ForgotPassword.jsx, ResetPassword.jsx
```

2. **Check App.jsx imports:**
```javascript
import Login from "./Screens/Auth/Login";
import Register from "./Screens/Auth/Register";
import ForgotPassword from "./Screens/Auth/ForgotPassword";
import ResetPassword from "./Screens/Auth/ResetPassword";
```

3. **Verify routes in App.jsx:**
```javascript
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
```

---

### ❌ "Protected routes show login page"

**Symptoms:**
```
Can't access /admin even after login
Always redirected to /login
ProtectedRoute not working
```

**Solutions:**

1. **Check ProtectedRoute component:**
```javascript
// frontend/src/components/ProtectedRoute.jsx
const token = localStorage.getItem("userToken");
if (!token) {
  return <Navigate to="/login" replace />;
}
```

2. **Verify token is being stored:**
```javascript
// In Login.jsx handleSubmit
localStorage.setItem("userToken", token);
localStorage.setItem("userType", user.role);
```

3. **Check localStorage directly:**
```javascript
// DevTools Console
localStorage.getItem("userToken")
// Should show JWT token, not null
```

---

### ❌ "CORS errors in browser"

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
Preflight request failed
```

**Solutions:**

1. **Verify CORS is enabled in backend:**
```javascript
// In app.js
app.use(
  cors({
    origin: process.env.FRONTEND_API_LINK || "http://localhost:3000",
  })
);
```

2. **Check .env for correct frontend URL:**
```
FRONTEND_URL=http://localhost:3000
```

3. **Restart backend after CORS changes:**
```bash
npm start
```

---

### ❌ "Token stays in localStorage after logout"

**Symptoms:**
```
After logout, can still see token in localStorage
Redirect to /admin still shows dashboard
```

**Solutions:**

1. **Verify logout clears localStorage:**
```javascript
// Should clear all auth data:
localStorage.removeItem("userToken");
localStorage.removeItem("userType");
localStorage.removeItem("userId");
localStorage.removeItem("userName");
```

2. **Test logout flow:**
```bash
1. Login successfully
2. DevTools → Application → Local Storage
3. See tokens stored
4. Click logout
5. Tokens should be gone
```

---

## Common Error Messages

### "Invalid credentials"
**Cause:** Wrong email or password
**Fix:** Verify credentials in testing guide or reseed database

### "User with this email already exists"
**Cause:** Trying to register with existing email
**Fix:** Use different email or clear users: `db.users.deleteMany({})`

### "Please provide all required fields"
**Cause:** Missing name, email, password, or role in registration
**Fix:** Fill all form fields

### "Passwords do not match"
**Cause:** Password and confirmPassword don't match in registration
**Fix:** Ensure both password fields are identical

### "Not authorized to access this route"
**Cause:** Missing or invalid JWT token
**Fix:** Login first and ensure token is in header: `Authorization: Bearer <token>`

### "User not found with this email"
**Cause:** Email doesn't exist for password reset
**Fix:** Use correct email or create account first

### "Invalid or expired reset token"
**Cause:** Reset token expired (30 minutes) or wrong token
**Fix:** Request new password reset

---

## Network Testing

### Check if backend is running:
```bash
# Terminal
curl http://localhost:4000

# Should show:
# Hello 👋 I am Working Fine 🚀
```

### Check API is working:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@college.com","password":"admin123"}'

# Should return JSON with token
```

### Check MongoDB connection:
```bash
# Terminal
mongosh college_management
db.users.find().limit(1)

# Should show at least one user
```

---

## Performance Issues

### ❌ "Login is slow"

**Cause:** Password hashing takes time
**Note:** This is normal (bcrypt intentionally slow for security)
**Solution:** Acceptable if takes 1-2 seconds

### ❌ "Memory leak / High CPU usage"

**Symptoms:**
```
Backend process uses increasing memory
CPU usage high even with few requests
```

**Solutions:**

1. **Check for infinite loops in middleware**
2. **Verify MongoDB connection pooling**
3. **Check for memory leaks in event listeners**
4. **Restart backend:** `npm start`

---

## Database Issues

### ❌ "E11000 duplicate key error"

**Cause:** Trying to insert duplicate email
**Solution:**
```bash
mongosh college_management
db.users.deleteMany({})
npm run seed
```

### ❌ "MongoDB connection timeout"

**Cause:** MongoDB not running or wrong URI
**Solution:**
```bash
# Check MongoDB is running:
mongosh

# If not, start it:
# Windows: mongod
# Mac: brew services start mongodb-community
```

---

## Quick Diagnostic Checklist

- [ ] Backend running? `curl http://localhost:4000`
- [ ] MongoDB connected? Check console output
- [ ] Users seeded? `mongosh` → `db.users.count()`
- [ ] Auth routes registered? Check `index.js`
- [ ] User model exists? Check `models/user.model.js`
- [ ] Auth controller exists? Check `controllers/auth.controller.js`
- [ ] JWT middleware exists? Check `middlewares/jwt.middleware.js`
- [ ] Frontend Auth components exist? Check `src/Screens/Auth/`
- [ ] ProtectedRoute exists? Check `src/components/ProtectedRoute.jsx`
- [ ] Token stored in localStorage? DevTools → Application → Local Storage

---

## Still Having Issues?

### Debug Steps:

1. **Clear everything and restart:**
```bash
# Backend
npm run seed
npm start

# Frontend (new terminal)
npm start
```

2. **Test with curl:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@college.com","password":"admin123"}'
```

3. **Check console outputs:**
   - Backend terminal for MongoDB/server logs
   - Browser console (F12) for frontend errors
   - Browser Network tab to see API requests

4. **Verify file structure:**
   - All new files exist in correct locations
   - No import path typos
   - All required dependencies installed

5. **Last resort:**
```bash
# Clear node_modules and reinstall
cd backend
rm -r node_modules
npm install
npm start
```

---

## Getting Help

1. **Check console error messages** - they usually explain the problem
2. **Look at API response** - DevTools Network tab shows what server returned
3. **Verify credentials** - Are you using correct email/password?
4. **Restart both servers** - Close and restart backend and frontend
5. **Check file permissions** - Ensure all files are readable
6. **Verify MongoDB** - Make sure MongoDB service is running

---

✅ **If all else fails:** Follow the [AUTHENTICATION_FIX_GUIDE.md](./AUTHENTICATION_FIX_GUIDE.md) step by step from the beginning.

