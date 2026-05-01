# 🧪 API Testing Guide

This file contains ready-to-use examples for testing the authentication API with Postman, curl, or VS Code REST Client.

---

## 📋 Setup for Testing

### Option 1: VS Code REST Client
1. Install "REST Client" extension by Huachao Mao
2. Create `.http` or `.rest` file
3. Copy examples below
4. Click "Send Request" above each request

### Option 2: Postman
1. Create new collection "Auth Tests"
2. Set base URL to `http://localhost:4000`
3. Copy each endpoint as new request
4. Click "Send"

### Option 3: curl (Terminal)
1. Copy curl commands directly
2. Run in terminal/PowerShell
3. See JSON response

---

## 🔑 Authentication Flow Tests

### 1️⃣ Register New User

**REST Client / Postman:**
```http
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "student"
}
```

**curl:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "student"
  }'
```

**Expected Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Test User",
      "email": "test@example.com",
      "role": "student"
    }
  },
  "message": "User registered successfully",
  "success": true
}
```

---

### 2️⃣ Login User

**REST Client / Postman:**
```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@college.com",
  "password": "admin123"
}
```

**curl:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@college.com",
    "password": "admin123"
  }'
```

**Expected Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@college.com",
      "role": "admin"
    }
  },
  "message": "Login successful",
  "success": true
}
```

---

### 3️⃣ Get Current User (Protected)

**REST Client / Postman:**
```http
GET http://localhost:4000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**curl:**
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@college.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "User retrieved successfully",
  "success": true
}
```

---

## 🔄 Password Management Tests

### 4️⃣ Request Password Reset

**REST Client / Postman:**
```http
POST http://localhost:4000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "admin@college.com"
}
```

**curl:**
```bash
curl -X POST http://localhost:4000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@college.com"}'
```

**Expected Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "message": "Password reset link sent to your email"
  },
  "message": "Email sent successfully",
  "success": true
}
```

---

### 5️⃣ Reset Password with Token

**REST Client / Postman:**
```http
POST http://localhost:4000/api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**curl:**
```bash
curl -X POST http://localhost:4000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "password": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

**Expected Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@college.com",
      "role": "admin"
    }
  },
  "message": "Password reset successfully",
  "success": true
}
```

---

### 6️⃣ Logout

**REST Client / Postman:**
```http
POST http://localhost:4000/api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**curl:**
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response (200):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Logout successful",
  "success": true
}
```

---

## ❌ Error Test Cases

### Invalid Email on Login

**Request:**
```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "nonexistent@example.com",
  "password": "password123"
}
```

**Response (401):**
```json
{
  "statusCode": 401,
  "data": null,
  "message": "Invalid credentials",
  "success": false
}
```

---

### Wrong Password on Login

**Request:**
```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@college.com",
  "password": "wrongpassword"
}
```

**Response (401):**
```json
{
  "statusCode": 401,
  "data": null,
  "message": "Invalid credentials",
  "success": false
}
```

---

### Missing Required Fields on Register

**Request:**
```http
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Please provide all required fields",
  "success": false
}
```

---

### Email Already Exists

**Request:**
```http
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "Another Admin",
  "email": "admin@college.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "admin"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "User with this email already exists",
  "success": false
}
```

---

### Passwords Don't Match

**Request:**
```http
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "differentpassword",
  "role": "student"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Passwords do not match",
  "success": false
}
```

---

### Missing Token on Protected Route

**Request:**
```http
GET http://localhost:4000/api/auth/me
```

**Response (401):**
```json
{
  "statusCode": 401,
  "data": null,
  "message": "Not authorized to access this route",
  "success": false
}
```

---

### Invalid Token

**Request:**
```http
GET http://localhost:4000/api/auth/me
Authorization: Bearer invalid_token_here
```

**Response (401):**
```json
{
  "statusCode": 401,
  "data": null,
  "message": "Not authorized to access this route",
  "success": false
}
```

---

### Expired Reset Token

**Request:**
```http
POST http://localhost:4000/api/auth/reset-password
Content-Type: application/json

{
  "token": "expired_token",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Invalid or expired reset token",
  "success": false
}
```

---

## 🎯 Complete Test Sequence

Follow this sequence to test all functionality:

```
1. ✅ Register New User
   POST /api/auth/register
   Save the token

2. ✅ Login with Registered User
   POST /api/auth/login
   Save the token

3. ✅ Get Current User
   GET /api/auth/me (with token from step 2)
   Verify user data

4. ✅ Request Password Reset
   POST /api/auth/forgot-password
   (Email would be sent in production)

5. ✅ Logout
   POST /api/auth/logout (with token)
   Token should no longer work

6. ✅ Test Error Cases
   Try invalid credentials
   Try missing fields
   Try invalid token

7. ✅ Login with Default User
   POST /api/auth/login
   Use: admin@college.com / admin123
```

---

## 📊 Quick Reference

| Operation | Method | Endpoint | Auth | Params |
|-----------|--------|----------|------|--------|
| Register | POST | `/api/auth/register` | ❌ | name, email, password, role |
| Login | POST | `/api/auth/login` | ❌ | email, password |
| Get User | GET | `/api/auth/me` | ✅ | - |
| Forgot Password | POST | `/api/auth/forgot-password` | ❌ | email |
| Reset Password | POST | `/api/auth/reset-password` | ❌ | token, password |
| Logout | POST | `/api/auth/logout` | ✅ | - |

---

## 💾 Save Token for Testing

After login, copy the token from response:

**For REST Client (Postman):**
1. Create variable: `@token = <paste_token_here>`
2. Use in headers: `Authorization: Bearer {{token}}`

**For Postman:**
1. Set to collection variables
2. Use in headers: `Authorization: Bearer {{token}}`

**For curl:**
```bash
TOKEN="paste_token_here"
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login successful |
| 201 | Created | User registered |
| 400 | Bad Request | Missing fields |
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | Account deactivated |
| 404 | Not Found | User not found |
| 409 | Conflict | Email already exists |
| 500 | Server Error | MongoDB error |

---

## ✅ Testing Checklist

- [ ] Register new user successfully
- [ ] Login with new user
- [ ] Get user details with token
- [ ] Login with default admin user
- [ ] Test invalid credentials
- [ ] Test missing fields
- [ ] Test invalid token
- [ ] Test logout
- [ ] Test forgot password
- [ ] Test all error cases

🎉 **All tests pass = Authentication system is working!**

