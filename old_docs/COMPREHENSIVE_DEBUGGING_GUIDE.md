# Complete Debugging & Testing Guide for MERN CMS

## 🚀 Complete Workflow - Step by Step

### Prerequisites
- MongoDB running: `mongod` (port 27017)
- Node.js installed
- VS Code or any code editor

### Start Backend
```bash
cd backend
npm install
npm run dev
```
**Expected Output:**
```
Server Listening On http://localhost:4000
Connected to MongoDB Successfully
🌱 No data found. Auto-seeding database...
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```
**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## 🔐 Authentication Fixes Implemented

### What Changed
1. **Registration System**
   - ✅ Students/Faculty/Admins now set their own PASSWORD
   - ✅ Email is user-provided (not auto-generated)
   - ✅ Profile image is optional
   - ❌ Removed hardcoded passwords like "student123", "faculty123", "admin123"

2. **Password Hashing**
   - ✅ All passwords hashed with bcrypt before storage
   - ✅ Pre-save hooks fixed for proper hashing
   - ✅ Uses SHA-256 hashing algorithm (10 salt rounds)

3. **Frontend Forms**
   - ✅ Added password input field to Faculty form
   - ✅ Added password input field to Student form  
   - ✅ Added password input field to Admin form
   - ✅ Password field only shows on CREATE (not on EDIT)

---

## ✅ Testing Workflow

### Test 1: Default Admin Login
```
URL: http://localhost:5173
1. Click "Admin" button
2. Email: admin@college.com
3. Password: admin123
4. Click "Sign In"
```

**Expected:**
- ✅ Login success message
- ✅ Redirected to Admin Dashboard
- ✅ "My Details" shows admin profile
- ✅ Token stored in localStorage

**How to Verify:**
- Open DevTools (F12) → Application → LocalStorage
- Look for `userToken` key
- Value should be long JWT token starting with "eyJh..."

---

### Test 2: Register New Student

#### Method 1: Using Admin Dashboard
1. Log in as Admin
2. Go to "Student" menu
3. Click "Add New Student" button
4. Fill form:
   ```
   First Name: John
   Middle Name: Michael
   Last Name: Doe
   Email: john.student@college.com (NEW - NOT AUTO-GENERATED)
   Password: securepass123 (NEW FIELD - REQUIRED)
   Phone: 9876543210
   Semester: 3
   Branch: Computer Science
   Gender: Male
   DOB: 2003-01-15
   Address, City, State, Pincode, Country: Fill appropriately
   Blood Group: O+
   ```
5. Click "Add Student"

**Expected:**
- ✅ Toast: "Student registered successfully!"
- ✅ Student appears in table
- ✅ Enrollment No auto-generated (e.g., 456123)
- ✅ Student data in MongoDB

#### Method 2: Using Postman API
```
POST http://localhost:4000/api/student/register

Headers:
Content-Type: multipart/form-data

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.student@college.com",
  "password": "securepass123",
  "phone": "9876543210",
  "semester": 3,
  "branchId": "<branch_id_from_db>",
  "gender": "male",
  "dob": "2003-01-15",
  "address": "123 Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "bloodGroup": "O+"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Student registered successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "enrollmentNo": 456123,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.student@college.com",
    "semester": 3,
    "createdAt": "2024-03-26T10:30:00.000Z"
  }
}
```

---

### Test 3: Login with New Student Account

1. Go to http://localhost:5173
2. Click "Student" button
3. Email: `john.student@college.com`
4. Password: `securepass123`
5. Click "Sign In"

**Expected:**
- ✅ Login successful
- ✅ Redirected to Student Dashboard
- ✅ Can see student-specific features

---

### Test 4: Register Faculty Member

#### Using Admin Dashboard
1. Log in as Admin
2. Go to "Faculty" menu
3. Click "Add New Faculty"
4. Fill form with:
   ```
   First Name: Dr.
   Last Name: Smith
   Email: dr.smith@college.com (NEW)
   Password: faculty2024 (NEW FIELD)
   Phone: 9876543210
   Designation: Associate Professor
   Branch: Computer Science
   And other details...
   ```
5. Submit

**Expected:**
- ✅ Faculty created with Employee ID auto-generated
- ✅ Can login with new credentials

---

### Test 5: Verify Password Hashing in MongoDB

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `College` database
4. Open `student_details` collection
5. Find the newly created student (John Doe)
6. Click on the document

**Verify:**
```
"password": "$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN..."
```

✅ **CORRECT:** Long string starting with `$2a$10$` (bcrypt hash)
❌ **WRONG:** Plain text like "securepass123"

---

### Test 6: Branch Management

**Create Branch:**
1. Admin Dashboard → Branch
2. Click "Add Branch"
3. Fill:
   - Branch ID: CSE
   - Name: Computer Science Engineering
4. Submit

**Expected:**
- ✅ Branch created
- ✅ Appears in dropdown in student/faculty forms

**Update Branch:**
1. Click edit icon
2. Change name to "Computer Science Engineering (Revised)"
3. Submit

**Expected:**
- ✅ Updated successfully

**Delete Branch:**
1. Click delete icon
2. Confirm

**Expected:**
- ✅ Branch removed

---

### Test 7: Exam Management

**Create Exam:**
1. Admin → Exam menu
2. Click "Add Exam"
3. Fill:
   ```
   Name: Data Structures Mid Exam
   Date: 2024-12-15
   Exam Type: mid
   Semester: 3
   Total Marks: 100
   ```
4. Upload timetable file (optional)
5. Submit

**Expected:**
- ✅ Exam created
- ✅ Visible in exam list

---

### Test 8: Attendance Management

**Mark Attendance:**
1. Admin → Attendance
2. Select Branch, Semester, Date
3. Filter students
4. Mark Present/Absent for each
5. Submit

**Expected:**
- ✅ Attendance recorded

**View Attendance:**
1. Click "View" or go to Attendance section
2. Filter by date range
3. See attendance records

**Expected:**
- ✅ Attendance shows correctly

---

### Test 9: Marks Management

**Add Marks (Faculty):**
1. Log in as Faculty
2. Go to Marks section
3. Select Exam, Subject, Semester
4. Enter marks for each student
5. Submit

**Expected:**
- ✅ Marks saved to database

**View Marks (Student):**
1. Log in as Student
2. Go to Marks section
3. See all marks for the student

**Expected:**
- ✅ Marks displayed correctly
- ✅ Only their own marks visible

---

## 🧪 API Testing with Postman

### Import Postman Collection

Create a new Postman collection with these endpoints:

#### 1. Login Student
```
POST http://localhost:4000/api/student/login
Body (JSON): {
  "email": "john.student@college.com",
  "password": "securepass123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Get Student Details
```
GET http://localhost:4000/api/student/my-details
Header: Authorization: Bearer <token_from_login>

Response:
{
  "success": true,
  "message": "My Details Found!",
  "data": {
    "_id": "...",
    "firstName": "John",
    "email": "john.student@college.com",
    "semester": 3
  }
}
```

#### 3. Get All Branches
```
GET http://localhost:4000/api/branch
Header: Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "All Branches Loaded!",
  "data": [
    {
      "_id": "...",
      "branchId": "CSE",
      "name": "Computer Science Engineering"
    }
  ]
}
```

#### 4. Create Subject
```
POST http://localhost:4000/api/subject
Header: 
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body:
{
  "name": "Data Structures",
  "code": "CS101",
  "semester": 3,
  "branch": "<branch_id>",
  "credits": 4
}
```

---

## 🔴 Common Issues & Solutions

### Issue 1: "Email already exists" on registration
**Cause:** Email was already used for another account
**Solution:** Use a different email address or check MongoDB to see existing emails

### Issue 2: "Invalid password" on login
**Cause:** Password doesn't match
**Solution:** 
- Check Caps Lock
- Verify email is correct
- Use default admin credentials to test first

### Issue 3: "User not found" on login
**Cause:** User doesn't exist in database
**Solution:** 
- Register user first
- Check MongoDB Compass to verify user exists
- Verify email spelling

### Issue 4: "Invalid or expired token"
**Cause:** JWT token expired (1 hour) or secret key mismatched
**Solution:**
- Login again to get new token
- Verify JWT_SECRET in .env file is consistent

### Issue 5: "CORS error in browser console"
**Cause:** Backend CORS not configured for frontend URL
**Solution:**
- Check `index.js` CORS configuration
- Verify `.env` FRONTEND_API_LINK matches frontend URL
- Restart backend server

### Issue 6: Cannot upload profile image
**Cause:** Multer middleware issue or folder doesn't exist
**Solution:**
- Create `backend/media` folder if doesn't exist
- Check folder permissions
- Verify file size < 5MB

### Issue 7: "Cannot find branch when adding student"
**Cause:** No branches created yet
**Solution:** Create branches first in Admin → Branch menu

### Issue 8: "ValidationError: email is required"
**Cause:** Didn't fill required fields
**Solution:** Fill all required fields (marked with *)

---

## 📊 Database Verification

### Check Admin User
```javascript
// In MongoDB Compass, open College > admin_details
// Should see:
{
  "_id": ObjectId("..."),
  "firstName": "Admin",
  "email": "admin@college.com",
  "password": "$2a$10$...[hashed]...",
  "employeeId": 100001,
  "status": "active"
}
```

### Check Registered Student
```javascript
// In College > student_details
// Should see:
{
  "_id": ObjectId("..."),
  "enrollmentNo": 456123,
  "firstName": "John",
  "email": "john.student@college.com",
  "password": "$2a$10$...[hashed]...",
  "semester": 3,
  "branchId": ObjectId("...")  // Reference to branch
}
```

### Check Relationships
- `branchId` in students should reference `_id` in branches
- `markedBy` in attendance should reference faculty ID
- `studentId` in marks should reference student ID

---

## ✨ Success Indicators

### Backend
- ✅ Server running without errors
- ✅ MongoDB connection successful
- ✅ Auto-seeding completes
- ✅ API responses have correct format

### Frontend
- ✅ Page loads without errors  
- ✅ Can select login role
- ✅ Forms have password field
- ✅ Can register new users
- ✅ Can login successfully

### Authentication
- ✅ Passwords are hashed in DB (not plain text)
- ✅ Login with correct credentials works
- ✅ Login with wrong password fails
- ✅ Token-based API calls work
- ✅ Expired tokens rejected

### CRUD Operations  
- ✅ Create operations save to DB
- ✅ Read operations fetch from DB
- ✅ Update operations change existing data
- ✅ Delete operations remove data
- ✅ No dummy data shown

### Data Integrity
- ✅ Foreign keys work (branchId references exist)
- ✅ Email uniqueness enforced
- ✅ Phone uniqueness enforced
- ✅ Required fields validated
- ✅ Data types correct in DB

---

## 🎯 Final Checklist

Before declaring system "FIXED":

- [ ] Default admin login works
- [ ] New student registration accepted
- [ ] All form fields accept input
- [ ] Password field appears in create forms
- [ ] Passwords hashed in database
- [ ] New credentials can login
- [ ] All CRUD operations work
- [ ] No dummy data displayed
- [ ] Roles work correctly
- [ ] Token authentication works
- [ ] API errors are informative
- [ ] File uploads work
- [ ] Database relationships correct
- [ ] Frontend calls real APIs
- [ ] No console errors

✅ All checked → **SYSTEM IS PRODUCTION READY!**

