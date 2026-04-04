# Testing Checklist - MERN Authentication System

## Pre-Testing Setup
- [ ] MongoDB is running
- [ ] Backend server started (`npm run dev` on port 4000)
- [ ] Frontend server started (`npm start` on port 3000)
- [ ] Browser DevTools open (F12)
- [ ] .env file configured with JWT_SECRET

---

## 1. UI & Navigation Tests

### Login Page
- [ ] Login page loads at `/login`
- [ ] Role selector shows 3 options (Student, Faculty, Admin)
- [ ] Selected role button is highlighted
- [ ] Email input field visible and functional
- [ ] Password input field visible with eye icon toggle
- [ ] "Forgot Password?" link present
- [ ] "Sign Up" link directs to register page
- [ ] Sign In button shows loading state when clicked
- [ ] Background animations visible

### Register Page
- [ ] Register page loads at `/register`
- [ ] Full name input field works
- [ ] Email input field validates format
- [ ] Password field shows/hides with eye toggle
- [ ] Confirm password field shows/hides with eye toggle
- [ ] Role selector shows 3 options
- [ ] Form validates before submission
- [ ] "Back to Login" link works
- [ ] All fields have proper error messages

### Forgot Password Page
- [ ] Forgot password page loads at `/forgot-password`
- [ ] Email input field present
- [ ] Send button visible
- [ ] Success message appears after submission
- [ ] UI shows "Try Another Email" after sending
- [ ] Console logs contain reset token (for testing)
- [ ] Back to Login link works

### Reset Password Page
- [ ] Reset password page loads with query params: `?token=xxx&email=xxx`
- [ ] New password field visible with eye toggle
- [ ] Confirm password field visible with eye toggle
- [ ] Form validates password strength (min 6 chars)
- [ ] Form checks passwords match
- [ ] Success message appears after reset
- [ ] Auto-redirect to dashboard after success
- [ ] Back to Login link works

---

## 2. Registration Tests

### Test 2.1: Valid Registration
- [ ] Navigate to `/register`
- [ ] Fill form:
  - Name: `Test Student`
  - Email: `teststudent@example.com`
  - Password: `Test@123456`
  - Confirm Password: `Test@123456`
  - Role: `Student`
- [ ] Submit form
- [ ] ✅ Success toast message appears
- [ ] ✅ Redirects to `/student` dashboard
- [ ] ✅ Token stored in localStorage
- [ ] ✅ User info stored in localStorage

### Test 2.2: Duplicate Email Registration
- [ ] Register with: `duplicate@example.com`
- [ ] Complete registration successfully
- [ ] Try registering again with same email
- [ ] ❌ Should show "Email already registered" error
- [ ] ❌ Should NOT create duplicate account

### Test 2.3: Invalid Email Format
- [ ] Try registering with: `notanemail`
- [ ] ❌ Should show email validation error (before submission)
- [ ] Try registering with: `test@` 
- [ ] ❌ Should show email validation error
- [ ] Try registering with: `test@domain`
- [ ] ❌ Should show email validation error

### Test 2.4: Weak Password
- [ ] Try registering with password: `123` (less than 6 chars)
- [ ] ❌ Should show "Password must be at least 6 characters" error
- [ ] Try registering with password: `test`
- [ ] ❌ Should show password length error

### Test 2.5: Password Mismatch
- [ ] Password: `TestPassword123`
- [ ] Confirm Password: `DifferentPassword123`
- [ ] ❌ Should show "Passwords do not match" error
- [ ] ❌ Submit button should be disabled (or show error on click)

### Test 2.6: Empty Fields
- [ ] Leave name empty, fill rest
- [ ] ❌ Should show "Name is required" error
- [ ] Leave email empty, fill rest
- [ ] ❌ Should show "Email is required" error
- [ ] Leave password empty, fill rest
- [ ] ❌ Should show "Password is required" error

### Test 2.7: Register Different Roles
- [ ] Register as Faculty
  - [ ] Email: `faculty123@example.com`
  - [ ] Role: `Faculty`
  - [ ] ✅ Should redirect to `/faculty` dashboard
- [ ] Register as Admin
  - [ ] Email: `admin123@example.com`
  - [ ] Role: `Admin`
  - [ ] ✅ Should redirect to `/admin` dashboard

---

## 3. Login Tests

### Test 3.1: Valid Login - Student
- [ ] Navigate to `/login`
- [ ] Select role: `Student`
- [ ] Email: `student@example.com` (or registered email)
- [ ] Password: `student@123` (or correct password)
- [ ] Click Sign In
- [ ] ✅ Success toast message
- [ ] ✅ Redirects to `/student` dashboard
- [ ] ✅ Token in localStorage
- [ ] ✅ userType is `Student`

### Test 3.2: Valid Login - Faculty
- [ ] Navigate to `/login`
- [ ] Select role: `Faculty`
- [ ] Email: `faculty@example.com`
- [ ] Password: `faculty@123`
- [ ] ✅ Redirects to `/faculty` dashboard
- [ ] ✅ userType is `Faculty`

### Test 3.3: Valid Login - Admin
- [ ] Navigate to `/login`
- [ ] Select role: `Admin`
- [ ] Email: `admin@example.com`
- [ ] Password: `admin@123`
- [ ] ✅ Redirects to `/admin` dashboard
- [ ] ✅ userType is `Admin`

### Test 3.4: Incorrect Password
- [ ] Email: `teststudent@example.com` (valid)
- [ ] Password: `WrongPassword123`
- [ ] ❌ Should show error: "Invalid email or password"
- [ ] ❌ Should NOT redirect
- [ ] ❌ Token should NOT be stored

### Test 3.5: Non-existent Email
- [ ] Email: `nonexistent@fake.com`
- [ ] Password: `anypassword123`
- [ ] ❌ Should show error: "Invalid email or password"
- [ ] ❌ Should NOT redirect

### Test 3.6: Empty Email
- [ ] Email: (empty)
- [ ] Password: `test@123`
- [ ] ❌ Should show validation error
- [ ] ❌ Submit should fail

### Test 3.7: Empty Password
- [ ] Email: `test@example.com`
- [ ] Password: (empty)
- [ ] ❌ Should show validation error
- [ ] ❌ Submit should fail

### Test 3.8: Role Selection
- [ ] Select Student → form shows student branding
- [ ] Select Faculty → form shows faculty branding
- [ ] Select Admin → form shows admin branding
- [ ] ✅ Role selection visual feedback works

### Test 3.9: Login From Different Roles
- [ ] Login as Student
- [ ] Go to `/login`
- [ ] Change role selector to Faculty
- [ ] Try to login as Faculty user
- [ ] ✅ Should work with new role selected

### Test 3.10: Remember Me
- [ ] Check "Remember me" checkbox
- [ ] Login successfully
- [ ] Close browser
- [ ] Reopen and go to localhost:3000
- [ ] ✅ Should auto-redirect to dashboard (token exists)

---

## 4. Password Reset Tests

### Test 4.1: Forgot Password - Valid Email
- [ ] Navigate to `/forgot-password`
- [ ] Email: `teststudent@example.com`
- [ ] Click Send Reset Link
- [ ] ✅ Success message appears
- [ ] ✅ Console shows reset token (without SMTP)
- [ ] ✅ UI switches to "Check Your Email" state

### Test 4.2: Forgot Password - Non-existent Email
- [ ] Email: `nonexistent@fake.com`
- [ ] Click Send Reset Link
- [ ] ✅ Should still show success message (for security)
- [ ] ❌ No reset link actually sent

### Test 4.3: Forgot Password - Empty Email
- [ ] Email: (empty)
- [ ] Click Send Reset Link
- [ ] ❌ Should show "Please enter your email" error

### Test 4.4: Try Another Email
- [ ] After first email submission
- [ ] Click "Try Another Email" button
- [ ] ✅ Form clears and resets
- [ ] ✅ Can enter another email

### Test 4.5: Reset Password - Valid Token
- [ ] Get reset token from console/email
- [ ] Construct URL: `http://localhost:3000/reset-password?token=XXX&email=teststudent@example.com`
- [ ] Navigate to URL
- [ ] ✅ Page loads with form
- [ ] New Password: `NewPassword123`
- [ ] Confirm Password: `NewPassword123`
- [ ] Click Reset Password
- [ ] ✅ Success message appears
- [ ] ✅ Auto-redirects to dashboard
- [ ] ✅ User logged in with new password

### Test 4.6: Reset Password - Password Mismatch
- [ ] Navigate to reset page with valid token
- [ ] New Password: `NewPassword123`
- [ ] Confirm Password: `DifferentPassword123`
- [ ] ❌ Should show "Passwords do not match" error

### Test 4.7: Reset Password - Weak Password
- [ ] New Password: `123` (less than 6 chars)
- [ ] ❌ Should show "Password must be at least 6 characters"

### Test 4.8: Reset Password - Expired Token
- [ ] Wait 10+ minutes after requesting reset
- [ ] Try to reset password
- [ ] ❌ Should show "Invalid or expired reset token" error

### Test 4.9: Reset Password - Invalid Token
- [ ] Navigate with fake token: `?token=faketoken123&email=test@example.com`
- [ ] ❌ Should show "Invalid or expired reset token" error

### Test 4.10: Reset Password - Missing Email
- [ ] Navigate without email param: `http://localhost:3000/reset-password?token=xxx`
- [ ] ❌ Should show error or redirect to login

### Test 4.11: Login After Password Change
- [ ] Successfully reset password to: `NewPassword123`
- [ ] Go to login page
- [ ] Login with NEW password
- [ ] ✅ Should work
- [ ] Go to login page again
- [ ] Try login with OLD password
- [ ] ❌ Should fail

---

## 5. Protected Routes Tests

### Test 5.1: Access Protected Route Without Login
- [ ] Clear localStorage completely
- [ ] Try to access: `http://localhost:3000/student`
- [ ] ❌ Should redirect to `/login`
- [ ] ❌ Should NOT show dashboard

### Test 5.2: Access Other Role's Dashboard
- [ ] Login as Student
- [ ] Try to access: `http://localhost:3000/faculty`
- [ ] Try to access: `http://localhost:3000/admin`
- [ ] ❌ Should show 403 Forbidden or redirect (depending on implementation)

### Test 5.3: Access Dashboard With Valid Token
- [ ] Login successfully
- [ ] Token in localStorage
- [ ] Access dashboard: `http://localhost:3000/student`
- [ ] ✅ Should show dashboard
- [ ] ✅ Should not redirect

### Test 5.4: Logout & Protected Route
- [ ] Login as any role
- [ ] Go to dashboard
- [ ] Clear localStorage (simulate logout)
- [ ] Refresh page
- [ ] ❌ Should redirect to login

### Test 5.5: Expired Token
- [ ] Login and get token
- [ ] Manually modify token in localStorage to invalid value
- [ ] Refresh dashboard page
- [ ] ❌ Should redirect to login with error

---

## 6. Data Persistence Tests

### Test 6.1: localStorage Keys
After login, verify localStorage contains:
- [ ] `userToken` - JWT token
- [ ] `userType` - User role
- [ ] `userId` - User ID
- [ ] `userName` - User name

### Test 6.2: Redux State
- [ ] Open Redux DevTools (if installed)
- [ ] Check that token is stored after login
- [ ] ✅ Redux state matches localStorage

### Test 6.3: Session Persistence
- [ ] Login successfully
- [ ] Refresh page: F5
- [ ] ✅ Still logged in (not redirected to login)
- [ ] ✅ Dashboard displays user info

---

## 7. API Response Tests

### Test 7.1: Successful Registration Response
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@api.com",
    "password": "test123",
    "role": "student"
  }'
```
- [ ] Status: 200 or 201
- [ ] Response has `data.token`
- [ ] Response has `data.user` with id, name, email, role
- [ ] Response has `success: true`

### Test 7.2: Successful Login Response
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@api.com",
    "password": "test123"
  }'
```
- [ ] Status: 200
- [ ] Response has `data.token`
- [ ] Response has `data.user`
- [ ] Response has `success: true` and message

### Test 7.3: Error Responses
- [ ] Invalid email: Status 400/422
- [ ] Invalid password: Status 401
- [ ] User not found: Status 401 or 404
- [ ] Server error: Returns proper error object

---

## 8. Middleware Tests

### Test 8.1: JWT Verification
- [ ] Get valid token from login
- [ ] Use token in Authorization header: `Bearer {token}`
- [ ] Call protected endpoint: `GET /api/auth/me`
- [ ] ✅ Should get user data

### Test 8.2: Missing Authorization Header
- [ ] Call protected endpoint WITHOUT token
- [ ] ❌ Should get 401 Unauthorized

### Test 8.3: Invalid Token Format
- [ ] Use Authorization: `Bearer invalid.token.here`
- [ ] Call protected endpoint
- [ ] ❌ Should get 401 Unauthorized

### Test 8.4: Malformed Bearer Token
- [ ] Use Authorization: `InvalidBearer {token}`
- [ ] ❌ Should get 401 Unauthorized

---

## 9. Email Tests (if SMTP configured)

### Test 9.1: Email Delivery
- [ ] Request password reset for valid email
- [ ] Check email inbox
- [ ] ✅ Email contains reset link
- [ ] ✅ Link has correct format: `{FRONTEND_URL}/reset-password?token=XXX&email=XXX`

### Test 9.2: Email Content
- [ ] Email should contain:
  - [ ] Subject line about password reset
  - [ ] Clear instructions
  - [ ] Reset link button
  - [ ] Token expiration info (10 minutes)
  - [ ] Security notice

### Test 9.3: Multiple Reset Requests
- [ ] Request 2 password resets for same email
- [ ] ✅ Both should generate new tokens
- [ ] ✅ Only latest token should be valid (depends on implementation)

---

## 10. Security Tests

### Test 10.1: Password Hashing
- [ ] Check MongoDB database
- [ ] User password should NOT be plain text
- [ ] Password should be bcrypt hash starting with `$2b$` or `$2a$`

### Test 10.2: Token in Network
- [ ] Open DevTools > Network
- [ ] Login and watch network request
- [ ] ✅ Token present in response
- [ ] ❌ Password should NOT be sent in response
- [ ] ✅ Login request should be over HTTPS in production

### Test 10.3: XSS Prevention
- [ ] Try to register with name: `<script>alert('xss')</script>`
- [ ] ❌ Script should not execute
- [ ] ❌ Should be stored as plain text, not executed
- [ ] On dashboard, should display as text, not HTML

### Test 10.4: SQL Injection Prevention
- [ ] Try login with email: `admin' OR '1'='1`
- [ ] ❌ Should not bypass authentication
- [ ] ❌ MongoDB injection attempts should fail

---

## 11. Cross-Browser Tests

Test on multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

For each browser:
- [ ] Register works
- [ ] Login works
- [ ] Password reset works
- [ ] Animations display correctly
- [ ] Form validation works
- [ ] localStorage persists

---

## 12. Responsive Design Tests

- [ ] Desktop (1920x1080)
  - [ ] All UI elements visible
  - [ ] Forms look good
  - [ ] Buttons clickable

- [ ] Tablet (768x1024)
  - [ ] Layout adapts
  - [ ] Forms still usable
  - [ ] Role selector displays properly

- [ ] Mobile (375x667)
  - [ ] Vertical layout works
  - [ ] Touch targets large enough (44x44px minimum)
  - [ ] Keyboard doesn't hide inputs
  - [ ] Form is scrollable if needed

---

## 13. Error Handling Tests

### Test 13.1: Network Errors
- [ ] Stop backend server
- [ ] Try to login
- [ ] ✅ Should show "Network error" or similar
- [ ] ✅ Should NOT crash application

### Test 13.2: Server Errors
- [ ] Mock 500 error response
- [ ] ✅ Should show appropriate error message
- [ ] ✅ Should allow retry

### Test 13.3: Validation Errors
- [ ] Each validation error has clear message
- [ ] Messages appear inline with form fields
- [ ] Messages are user-friendly, not technical

---

## Test Results Summary

### Pass/Fail Checklist Template
```
Total Tests: ___
✅ Passed: ___
❌ Failed: ___
⏭️  Skipped: ___

Critical Failures:
- [List any critical failures]

Known Issues:
- [List known issues]

Notes:
- [Additional observations]

Tester: _______________
Date: __________________
Time: __________________
```

---

## Sign-Off

- [ ] All critical tests passed
- [ ] No blocking issues
- [ ] Ready for deployment
- [ ] Documentation updated

**Tester Name**: _______________________
**Date**: _______________________
**Environment**: [Development/Staging/Production]

---

**Test Suite Version**: 1.0
**Last Updated**: March 31, 2026
