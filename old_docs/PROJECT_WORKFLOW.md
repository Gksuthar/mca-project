# 📊 Complete Project Workflow - College Management System

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [User Authentication Flow](#user-authentication-flow)
4. [Admin Module Workflow](#admin-module-workflow)
5. [Faculty Module Workflow](#faculty-module-workflow)
6. [Student Module Workflow](#student-module-workflow)
7. [Data Management Flow](#data-management-flow)
8. [File Upload Flow](#file-upload-flow)
9. [Real-time Update Flow](#real-time-update-flow)
10. [Error Handling Flow](#error-handling-flow)
11. [Database Schema & Relations](#database-schema--relations)
12. [Complete Use Cases](#complete-use-cases)

---

## System Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Admin Pages  │  │ Faculty Page │  │ Student Page │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘               │
│                            │                                  │
│        AxiosWrapper + Redux State Management                 │
│        (Auto JWT Token Injection)                           │
└────────────────────────────┼──────────────────────────────────┘
                              │
                    HTTP REST API Calls
                   (Authorization Headers)
                              │
┌────────────────────────────┼──────────────────────────────────┐
│           BACKEND (Node.js + Express)                        │
│                            │                                  │
│        ┌──────────────────┴───────────────────┐              │
│        │   API Routes & Endpoints             │              │
│        │   - /api/student/*                   │              │
│        │   - /api/faculty/*                   │              │
│        │   - /api/admin/*                     │              │
│        │   - /api/branch/*                    │              │
│        │   - /api/subject/*                   │              │
│        │   - /api/attendance/*                │              │
│        │   - /api/marks/*                     │              │
│        │   - /api/material/*                  │              │
│        │   - /api/exam/*                      │              │
│        │   - /api/timetable/*                 │              │
│        │   - /api/notice/*                    │              │
│        └──────────────────┬───────────────────┘              │
│                           │                                  │
│        ┌──────────────────┴───────────────────┐              │
│        │  JWT Auth Middleware                 │              │
│        │  (Verify Token & User Type)          │              │
│        └──────────────────┬───────────────────┘              │
│                           │                                  │
│        ┌──────────────────┴───────────────────┐              │
│        │  Controllers (Business Logic)        │              │
│        │  - processRequest()                  │              │
│        │  - validateData()                    │              │
│        │  - executeOperation()                │              │
│        └──────────────────┬───────────────────┘              │
│                           │                                  │
│        ┌──────────────────┴───────────────────┐              │
│        │  Models (Database Schemas)           │              │
│        │  - Student Model                     │              │
│        │  - Faculty Model                     │              │
│        │  - Admin Model                       │              │
│        │  - Subject, Branch, etc.             │              │
│        └──────────────────┬───────────────────┘              │
│                           │                                  │
└────────────────────────────┼──────────────────────────────────┘
                              │
                    MongoDB Query & Storage
                              │
                ┌─────────────┴──────────────┐
                │                            │
         ┌──────▼──────┐           ┌─────────▼────────┐
         │  Documents  │           │  File Storage    │
         │  (JSON Data)│           │  (/media folder) │
         └─────────────┘           └──────────────────┘
         
         Database: College
         Collections: 11 total
```

---

## Architecture Diagram

```
REQUEST FLOW: User → Frontend → Backend → Database → Frontend (UI Update)

1. USER ACTION
   └─ Click Button / Submit Form
      └─ React Component Event Handler

2. FRONTEND PROCESSING
   └─ Validate Input Data
   └─ Prepare Request Object
   └─ Call AxiosWrapper.get/post/put/delete()
      └─ Interceptor Adds JWT Token
      └─ Interceptor Adds Headers

3. NETWORK TRANSMISSION
   └─ HTTP Request Sent to Backend
   └─ Headers Include: Authorization, Content-Type, etc.

4. BACKEND INITIAL PROCESSING
   └─ Express Router matches route
   └─ Multer Middleware handles file upload (if present)
   └─ Request passed to Auth Middleware

5. AUTHENTICATION CHECK
   └─ Extract token from header
   └─ Verify token signature
   └─ Check token expiration
   └─ If invalid → return 401 error
   └─ If valid → extract userId, userType
   └─ Pass to next middleware/controller

6. BUSINESS LOGIC (Controller)
   └─ Validate request data
   └─ Check permissions (role-based)
   └─ Execute database query
   └─ Process response

7. DATABASE OPERATION
   └─ Connect to MongoDB
   └─ Find/Create/Update/Delete document
   └─ Apply validation rules
   └─ Return result to controller

8. BACKEND RESPONSE
   └─ Format response using ApiResponse helper
   └─ Create JSON: { success, message, data }
   └─ Set HTTP status code
   └─ Send response to frontend

9. FRONTEND RESPONSE HANDLING
   └─ Response Interceptor processes response
   └─ Check if success = true
   └─ Update Redux store with data
   └─ Show success/error toast notification
   └─ Re-render component with new data

10. UI UPDATE
    └─ React re-renders component
    └─ Display updated data from Redux store
    └─ Show new list/updated form/dashboard stats
```

---

## User Authentication Flow

### 1. REGISTRATION FLOW (Backend Only - Admin Creates Users)

```
Admin Manual Database Entry
        ↓
MongoDB Insert Document
        ↓
User Created with:
  - Email
  - Password (bcryptjs encrypted)
  - Name, Role
  - Contact Details
```

**NO public registration endpoint** - Only DB seeding/manual admin entry

### 2. LOGIN FLOW (Complete Cycle)

```
┌─ USER ENTERS CREDENTIALS ─┐
│ Email: student@college.com
│ Password: student123
└───────────────┬───────────┘
                │
        ┌───────▼────────┐
        │  Select Role   │
        │ (Student/      │
        │  Faculty/Admin)│
        └───────┬────────┘
                │
        Choose Endpoint:
        ├─ Student: /api/student/login
        ├─ Faculty: /api/faculty/login
        └─ Admin: /api/admin/login
                │
        ┌───────▼────────────────────┐
        │  Backend Route Handler     │
        │  (student.route.js)        │
        └───────┬────────────────────┘
                │
        ┌───────▼────────────────────┐
        │  Student Controller        │
        │  (student.controller.js)   │
        │  - loginController()       │
        └───────┬────────────────────┘
                │
        ┌───────▼────────────────────┐
        │  Find Student in Database  │
        │  Model.findOne({email})    │
        └───────┬────────────────────┘
                │
        ┌───────▼───────────────────┐
        │ Check if student exists   │
        │ IF NO → Return error 404  │
        └───────┬───────────────────┘
                │
        ┌───────▼───────────────────────────┐
        │  Compare Passwords                │
        │  bcryptjs.compare(               │
        │    password,                      │
        │    student.password               │
        │  )                                │
        │  IF NO MATCH → Return error 401   │
        └───────┬───────────────────────────┘
                │
        ┌───────▼───────────────────────────┐
        │  Generate JWT Token               │
        │  jsonwebtoken.sign({              │
        │    id: student._id,               │
        │    email: student.email,          │
        │    type: "student"                │
        │  }, SECRET, {                     │
        │    expiresIn: "1h"                │
        │  })                               │
        └───────┬───────────────────────────┘
                │
        ┌───────▼──────────────────────────┐
        │  Return Success Response         │
        │  {                               │
        │    success: true,                │
        │    message: "Login successful",  │
        │    data: {                       │
        │      token: "jwt_token_here",   │
        │      user: {...}                │
        │    }                             │
        │  }                               │
        └───────┬──────────────────────────┘
                │
        ┌───────▼────────────────────────┐
        │  Frontend Response Processing  │
        │  (Login.jsx)                   │
        │  - Check response.success      │
        │  - Extract token              │
        └───────┬────────────────────────┘
                │
        ┌───────▼────────────────────────┐
        │  Store Data Locally            │
        │  localStorage.setItem(         │
        │    "userToken",               │
        │    token                      │
        │  )                            │
        │  localStorage.setItem(        │
        │    "userType",                │
        │    "student"                  │
        │  )                            │
        └───────┬────────────────────────┘
                │
        ┌───────▼────────────────────────┐
        │  Redux Action Dispatch         │
        │  - Save token in Redux         │
        │  - Save user details in Redux  │
        └───────┬────────────────────────┘
                │
        ┌───────▼────────────────────────┐
        │  Redirect to Dashboard         │
        │  /student → StudentDashboard   │
        │  Path: /src/Screens/           │
        │        Student/Home.jsx        │
        └────────────────────────────────┘

✅ LOGIN COMPLETE
   User logged in, token stored, ready for API calls
```

### 3. TOKEN USAGE IN API CALLS

```
EVERY API CALL:
└─ AxiosWrapper Request Interceptor runs
   ├─ Get token from: localStorage.getItem("userToken")
   ├─ Add to Headers: {
   │    Authorization: `Bearer ${token}`,
   │    Content-Type: "application/json"
   │  }
   └─ Send request with token

BACKEND VALIDATION:
└─ Express Auth Middleware checks token
   ├─ Extract from: req.headers.authorization
   ├─ Verify: jwt.verify(token, SECRET)
   ├─ If invalid → throw 401 error
   ├─ If expired → throw 403 error
   ├─ If valid → Extract userId & continue
   └─ Attach to req.user for controller

CONTROLLER ACCESS:
└─ Access authenticated user info
   ├─ req.user._id → Student/Faculty/Admin ID
   ├─ req.user.type → Role type
   └─ Use in database queries
```

### 4. TOKEN EXPIRATION & LOGOUT

```
TOKEN EXPIRES (After 1 hour):
└─ Frontend request fails with 403
└─ Response Interceptor catches error
└─ Clear localStorage
└─ Clear Redux store
└─ Redirect to /login
└─ Show "Session expired" message

MANUAL LOGOUT:
└─ User clicks Logout button
└─ Clear localStorage
└─ Clear Redux store  
└─ Redirect to /login
└─ Success message
```

---

## Admin Module Workflow

### 1. ADMIN DASHBOARD WORKFLOW

```
ADMIN OPENS DASHBOARD
    ↓
Component: AdminDashboard.jsx
    ↓
useEffect() runs on mount
    ├─ GET /api/student → Count: total students
    ├─ GET /api/faculty → Count: total faculty
    ├─ GET /api/branch → Count: total branches
    ├─ GET /api/subject → Count: total subjects
    └─ Calculate: attendance percentage
        ↓
Redux Dispatch (Store data)
    ↓
Component Re-render with:
├─ 4 Stat Cards (Students, Faculty, Branches, Subjects)
├─ Charts (Semester distribution, Attendance graph)
├─ Recent activities
└─ Quick action buttons

REAL-TIME UPDATE:
- Each API call automatically has JWT token (from interceptor)
- Data fetched fresh from MongoDB each time
- If new student added → Dashboard shows updated count
- If student deleted → Dashboard decreases count
```

### 2. STUDENT MANAGEMENT WORKFLOW

```
ADMIN GOES TO: /admin/student
    ↓
Component: Student.jsx
    ↓
┌─ VIEW ALL STUDENTS ─────────┐
│ GET /api/student            │
│ Returns: { success, data }  │
│ Display in table/card list  │
└─────────────────────────────┘
    │       │        │
    │       │        └──────────────────┐
    │       │                           │
    │   ┌───▼────────────────┐    ┌─────▼─────────────┐
    │   │ SEARCH STUDENTS    │    │ FILTER STUDENTS   │
    │   │ GET /api/student/  │    │ GET /api/student/ │
    │   │ search             │    │ filter            │
    │   │ ?name=...          │    │ ?branch=...       │
    │   │ ?email=...         │    │ ?semester=...     │
    │   │ Returns: filtered  │    │ Returns: filtered │
    │   │ student list       │    │ student list      │
    │   └────────────────────┘    └───────────────────┘
    │
    ├─────────────────────────────────────────┐
    │                                         │
    │                           ┌─ UPDATE STUDENT ─┐
    │                           │ PATCH /api/      │
    │                           │ student/:id      │
    │                           │ Send changes     │
    │                           │ Database updates │
    │                           │ List re-renders  │
    │                           └──────────────────┘
    │
    ├─ ADD NEW STUDENT           │            ├─ DELETE STUDENT
    │ Form with fields:          │            │ DELETE /api/student/:id
    │ - Name                     │            │ Confirm delete
    │ - Email                    │            │ Database removes
    │ - Contact                  │            │ UI updates
    │ - Branch/Semester          │            │
    │ - Upload Photo             │            │
    │ POST /api/student/register │            │
    │ Database stores            │            │
    │ List refreshes             │            │
    │                            │            │
    └────────────────────────────┴────────────┘

WORKFLOW WITH STATE UPDATES:
1. Admin clicks "Add Student"
2. Form opens
3. Admin fills details
4. Selects photo file
5. Clicks Submit
6. Frontend validates inputs
7. Sends POST to /api/student/register with file
8. Multer middleware processes upload
9. File saved to /media
10. Student created in database
11. Response returns success
12. Toast shows "Student added successfully"
13. Form closes
14. Student list API called again
15. New student appears in list instantly
```

### 3. FACULTY MANAGEMENT WORKFLOW

```
ADMIN GOES TO: /admin/faculty

SIMILAR TO STUDENT WORKFLOW:
├─ View all faculty: GET /api/faculty
├─ Search/filter: GET /api/faculty?search=...
├─ Add new: POST /api/faculty/register
├─ Update: PATCH /api/faculty/:id
└─ Delete: DELETE /api/faculty/:id

FILE UPLOAD FLOW:
1. Upload photo/resume file
2. Multer middleware intercepts
3. Validates file type & size
4. Saves to /media with timestamp name
5. Returns filename to database
6. Stores reference in faculty document
7. File URL ready for display
```

### 4. SUBJECT MANAGEMENT WORKFLOW

```
ADMIN GOES TO: /admin/subject

CREATE SUBJECT:
├─ Form fields:
│  ├─ Subject Name (required)
│  ├─ Subject Code (unique)
│  ├─ Department/Branch
│  └─ Semester
├─ POST /api/subject
├─ Database creates record
└─ List updates

UPDATE SUBJECT:
├─ Click edit button
├─ Form pre-fills current data
├─ Change fields
├─ PATCH /api/subject/:id
├─ Database updates
└─ List refreshes

DELETE SUBJECT:
├─ Click delete
├─ Confirmation dialog
├─ DELETE /api/subject/:id
├─ Database removes
└─ List updates
```

### 5. BRANCH MANAGEMENT WORKFLOW

```
ADMIN GOES TO: /admin/branch

SAME CRUD OPERATIONS:
├─ View: GET /api/branch
├─ Create: POST /api/branch
├─ Update: PATCH /api/branch/:id
└─ Delete: DELETE /api/branch/:id

BRANCH FIELDS:
├─ Branch Name (CSE, ECE, ME, etc.)
├─ Description
├─ Number of Semesters
└─ Total Subjects
```

### 6. EXAM MANAGEMENT WORKFLOW

```
ADMIN GOES TO: /admin/exam

UPLOAD EXAM FILE:
1. Click "Upload Exam"
2. Select exam details:
   ├─ Exam Name
   ├─ Branch
   ├─ Semester
   └─ Date/Time
3. Upload file (PDF schedule)
4. POST /api/exam with FormData
5. Multer saves file to /media
6. Database stores reference
7. Exam visible to students

UPDATE EXAM:
├─ PUT /api/exam/:id
├─ Can modify details
├─ Can re-upload file
└─ Students see updated info

DELETE EXAM:
├─ DELETE /api/exam/:id
├─ File deleted from /media
├─ Database record removed
└─ No longer visible
```

### 7. NOTICE MANAGEMENT WORKFLOW

```
ADMIN GOES TO admin notices section

CREATE NOTICE:
1. Click "Add Notice"
2. Fill fields:
   ├─ Title
   ├─ Description
   ├─ Priority (Low/Medium/High)
   └─ Target Audience (All/Faculty/Students)
3. POST /api/notice
4. Database stores
5. Appears in notice board

NOTICE VISIBILITY:
├─ All students see: general notices
├─ Specific faculty see: targeted notices
├─ Admin can edit/delete notices
└─ Students can only view
```

---

## Faculty Module Workflow

### 1. FACULTY DASHBOARD WORKFLOW

```
FACULTY OPENS DASHBOARD
    ↓
Component: FacultyDashboard.jsx
    ↓
Displays:
├─ My assigned subjects
├─ Number of students per subject
├─ Upcoming classes
├─ Total materials uploaded
├─ Today's attendance schedule
└─ Quick action buttons
    ↓
Quick Actions:
├─ Mark Attendance
├─ Upload Marks
├─ Upload Material
└─ View Timetable
```

### 2. ATTENDANCE MARKING WORKFLOW

```
FACULTY CLICKS: Mark Attendance
    ↓
Component: Attendance.jsx
    ↓
WORKFLOW:
1. Select Branch
2. Select Semester
3. Select Date
4. GET /api/student?branch=...&semester=...
   │ Returns: list of students in that branch
   │
5. Display student list with checkboxes
   ├─ Checkbox → Present (✓)
   ├─ Blank → Absent
   ├─ Red mark → Leave/Excused
   │
6. Faculty marks attendance
7. Click "Submit Attendance"
8. POST /api/attendance with:
   {
     branch: "CSE",
     semester: 3,
     date: "2026-03-14",
     students: [
       { _id: "student_id_1", status: "present" },
       { _id: "student_id_2", status: "absent" },
       { _id: "student_id_3", status: "leave" }
     ]
   }
   │
9. Backend:
   ├─ Validate data
   ├─ Check if already marked for date
   ├─ For each student:
   │  ├─ Find attendance record
   │  ├─ Update/Create entry
   │  └─ Update MongoDB
   └─ Return success
   │
10. Frontend shows: "Attendance marked successfully"
11. Toast notification appears
12. Attendance marked (stored in database)

STUDENT ATTENDANCE VIEW:
└─ Student can view attendance
   ├─ GET /api/attendance/student
   ├─ Shows: Present/Absent/Leave for each date
   ├─ Calculates: Attendance % = Present/Total × 100
   └─ Shows warning if < 75%
```

### 3. MARKS UPLOAD WORKFLOW (Bulk)

```
FACULTY CLICKS: Upload Marks
    ↓
Component: UploadMarks.jsx
    ↓
WORKFLOW:
1. Select:
   ├─ Branch
   ├─ Subject
   ├─ Semester
   └─ Exam (Mid/Final)
   │
2. Two options:
   ├─ OPTION A: Upload CSV file
   │  ├─ CSV format:
   │  │  Email, Marks
   │  │  student1@college.com, 85
   │  │  student2@college.com, 92
   │  │  ...
   │  │
   │  ├─ GET /api/student?branch=...
   │  ├─ Parse CSV
   │  ├─ Map email to studentId
   │  └─ POST /api/marks/bulk
   │     {
   │       subject: id,
   │       exam: id,
   │       semester: 3,
   │       marks: [
   │         { studentId, marksObtained: 85 },
   │         { studentId, marksObtained: 92 }
   │       ]
   │     }
   │
   └─ OPTION B: Enter manually
      ├─ GET /api/student?branch=...
      ├─ Display form with all students
      ├─ Faculty enters marks for each
      ├─ POST /api/marks (one by one OR bulk)
      └─ Alternative: POST /api/marks/bulk with array

3. Backend Processing:
   ├─ Validate marks (0-max marks)
   ├─ Check student exists
   ├─ Check subject assigned
   ├─ For each mark entry:
   │  ├─ Find/Create marks document
   │  ├─ Update marksObtained
   │  ├─ Calculate percentage
   │  └─ Save to MongoDB
   └─ Return success list

4. Frontend Response:
   ├─ Show success count (85 marks added)
   ├─ Show failure count (if any)
   ├─ Toast notification
   └─ Redirect to marks list

STUDENT VIEW MARKS:
└─ Student goes to: /student/marks
   ├─ GET /api/marks/student
   ├─ Filter by semester
   ├─ Shows:
   │  ├─ Subject name
   │  ├─ Exam type
   │  ├─ Marks obtained
   │  ├─ Total marks
   │  └─ Percentage
   └─ Can download as PDF
```

### 4. MARKS UPDATE WORKFLOW (Individual)

```
FACULTY VIEWS MARKS:
    ↓
GET /api/marks (all marks or filtered)
    ↓
Display in table:
├─ Student name
├─ Subject
├─ Exam
├─ Marks obtained
└─ Edit button

FACULTY CLICKS EDIT:
    ↓
Open form with current marks
    ↓
Change marks value
    ↓
PATCH /api/marks/:id
    {
      marksObtained: 88 (changed from 85)
    }
    ↓
Backend updates MongoDB
    ↓
List refreshes
    ↓
Success message shown
```

### 5. MATERIAL UPLOAD WORKFLOW

```
FACULTY CLICKS: Upload Material
    ↓
Component: Material.jsx
    ↓
FORM FIELDS:
├─ Title (Chapter name, topic)
├─ Description
├─ Subject (dropdown)
├─ Semester
├─ File (PDF/DOC/PPTX)
├─ Upload button
└─ Submit button

UPLOAD PROCESS:
1. Faculty fills form
2. Selects file (validates type & size)
3. Click Submit
4. Frontend creates FormData:
   └─ Append: title, subject, semester, description
   └─ Append: file (binary)
5. POST /api/material (with FormData)
6. Headers:
   ├─ Content-Type: multipart/form-data
   ├─ Authorization: Bearer {token}
   └─ Other headers auto-added by AxiosWrapper
7. Backend Multer middleware:
   ├─ Receives multipart request
   ├─ Saves file to /media with timestamp
   ├─ Returns filename
8. Controller:
   ├─ Validates form fields
   ├─ Creates material document:
   │  {
   │    title: "...",
   │    subject: id,
   │    semester: 3,
   │    description: "...",
   │    filePath: "/media/timestamp.pdf",
   │    uploadedBy: faculty_id,
   │    uploadedAt: date
   │  }
   ├─ Saves to MongoDB
   └─ Returns success
9. Frontend:
   ├─ Shows success toast
   ├─ Clears form
   ├─ Refreshes material list
   └─ New material appears

MATERIAL UPDATE:
1. Faculty clicks edit
2. Form pre-fills data
3. Can:
   ├─ Update title/description
   ├─ Upload new file (replaces old)
   └─ PUT /api/material/:id
4. Old file deleted from /media
5. New file saved
6. Database updated
7. List refreshes

MATERIAL DELETE:
├─ Click delete button
├─ Confirm deletion
├─ DELETE /api/material/:id
├─ File removed from /media
├─ Database record deleted
└─ List updates

STUDENT DOWNLOADS MATERIAL:
├─ Student sees material in list
├─ Clicks download button
├─ File URL: /media/timestamp.pdf
├─ Browser downloads file
└─ Faculty can see download stats (optional)
```

### 6. TIMETABLE VIEW WORKFLOW

```
FACULTY WANTS TO VIEW TIMETABLE:
    ↓
GET /api/timetable
    ↓
Filter by:
├─ Branch
├─ Semester
└─ Date range

Display:
├─ Day | Time | Subject | Room | Faculty
├─ Mon | 9-10 | CSE201  | A101 | Dr. Smith
├─ Mon | 10-11| CSE203  | A102 | Dr. Jones
└─ etc...

Faculty can:
├─ View their assigned classes
├─ Print timetable
└─ Check classroom assignment
```

---

## Student Module Workflow

### 1. STUDENT DASHBOARD WORKFLOW

```
STUDENT OPENS DASHBOARD
    ↓
Component: StudentDashboard.jsx
    ↓
Displays:
├─ Welcome message with name
├─ Current semester
├─ Quick stats:
│  ├─ Attendance %
│  ├─ Average marks
│  ├─ Materials available
│  └─ Upcoming exams
├─ Attendance meter (pie chart)
├─ Marks by subject (bar chart)
└─ Important notices (latest 5)

DASHBOARD UPDATES:
└─ All data fetched fresh from MongoDB
   ├─ GET /api/student/my-details
   ├─ GET /api/attendance/student
   ├─ GET /api/marks/student
   ├─ GET /api/notice
   └─ GET /api/exam
```

### 2. VIEW ATTENDANCE WORKFLOW

```
STUDENT CLICKS: Attendance
    ↓
GET /api/attendance/student
    ↓
Returns:
{
  attendance: [
    { date: "2026-03-10", status: "present" },
    { date: "2026-03-09", status: "absent" },
    ...
  ],
  statistics: {
    total: 100,
    present: 85,
    absent: 15,
    percentage: 85%
  }
}
    ↓
Display:
├─ Table with attendance history
├─ Attendance % (85/100 = 85%)
├─ Warning if < 75%:
│  └─ "⚠️ Your attendance is 65%. Please attend classes!"
├─ Filter by month
└─ Export to PDF

CALCULATION LOGIC:
└─ Attendance % = (Total Present × 100) / Total Classes
   └─ Example: 85 present out of 100 = 85%
```

### 3. VIEW MARKS WORKFLOW

```
STUDENT CLICKS: Marks
    ↓
GET /api/marks/student
    ↓
Returns:
{
  marks: [
    {
      subject: "Data Structures",
      exam: "Mid-Semester",
      obtained: 85,
      total: 100,
      percentage: 85%
    },
    {
      subject: "Database",
      exam: "Final",
      obtained: 78,
      total: 100,
      percentage: 78%
    }
  ]
}
    ↓
Display:
├─ Table showing all marks
├─ Calculate average: (85+78+...)/count
├─ Show progress:
│  ├─ Green bar: >80% (excellent)
│  ├─ Yellow bar: 60-80% (good)
│  └─ Red bar: <60% (warning)
├─ Filter by semester
├─ Filter by exam type
└─ Export to PDF

CALCULATION:
└─ Each mark shows: Obtained/Total (Percentage)
   └─ Example: 85/100 (85%)
```

### 4. DOWNLOAD MATERIALS WORKFLOW

```
STUDENT CLICKS: Materials
    ↓
GET /api/material?subject=...&semester=...
    ↓
Display available materials:
├─ Material title
├─ Subject name
├─ Upload date
├─ File size
├─ Download button
└─ Faculty name (uploaded by)

WORKFLOW:
1. Student sees material list
2. Clicks "Download"
3. Frontend redirects to:
   └─ /media/1771650830681.pdf (timestamp-based filename)
4. Browser downloads file
5. File saved to Downloads folder
6. Optional: Backend tracks download (for analytics)

MATERIAL VIEWING:
├─ Can open in browser (PDF/DOC)
├─ Can download for offline access
├─ Can read description
└─ Can see upload date & faculty name
```

### 5. VIEW EXAMS WORKFLOW

```
STUDENT CLICKS: Exams
    ↓
GET /api/exam?branch=...&semester=...
    ↓
Display:
├─ Exam name
├─ Date & time
├─ Room/Location (from PDF)
├─ Subject
├─ Download button (for exam schedule PDF)
└─ Exam type (Mid/Final)

WORKFLOW:
1. Student views exam list
2. Can see:
   ├─ Which exams are coming
   ├─ When exactly (date/time)
   ├─ In which location
   └─ Download schedule sheet
3. Clicks download
4. Gets /media/exam_schedule.pdf
5. Can plan exam preparation
```

### 6. VIEW TIMETABLE WORKFLOW

```
STUDENT CLICKS: Timetable
    ↓
GET /api/timetable?branch=...&semester=...
    ↓
Display class schedule:
├─ Day | Time | Subject | Room | Faculty
├─ Mon | 9-10 | DSA     | A101 | Dr. Smith
├─ Mon | 10-11| DB      | A102 | Dr. Jones
├─ Tue | 9-10 | Web Dev | B201 | Mr. Patel
└─ ...

FEATURES:
├─ View by week
├─ View by day
├─ Color coding: Different color per subject
├─ Can download as PDF
├─ Print option
└─ Set reminders (browser notifications)
```

### 7. READ NOTICES WORKFLOW

```
STUDENT CLICKS: Notices
    ↓
GET /api/notice
    ↓
Display notices:
├─ Notice title
├─ Date posted
├─ Priority (color-coded):
│  ├─ 🔴 High (red)
│  ├─ 🟡 Medium (yellow)
│  └─ 🟢 Low (green)
├─ Preview text
└─ Read more button

CLICK READ MORE:
├─ Open notice details
├─ Full description
├─ Posted by: Admin
├─ Posted date
├─ Can save/bookmark notice
└─ Can download if attachment

FEATURES:
├─ Filter by priority
├─ Search by keyword
├─ Sort by date
├─ Mark as read
└─ Archive old notices
```

### 8. PROFILE MANAGEMENT WORKFLOW

```
STUDENT CLICKS: Profile
    ↓
GET /api/student/my-details
    ↓
Display current profile:
├─ Name
├─ Email
├─ Phone
├─ Roll number
├─ Branch
├─ Semester
├─ Profile picture
├─ Address
├─ DOB
└─ Emergency contact

EDIT PROFILE:
1. Click "Edit Profile" button
2. Form becomes editable
3. Can modify:
   ├─ Phone number
   ├─ Address
   ├─ Emergency contact
   ├─ Profile picture (upload new)
   └─ Cannot change: Email, Roll#, Branch, Semester
4. Click "Save"
5. PATCH /api/student/:id
6. If image uploaded:
   ├─ FormData append image file
   ├─ Multer saves to /media
   ├─ Backend stores filename
   └─ Image URL updated
7. Database updates
8. Profile refreshes
9. Success message

CHANGE PASSWORD:
├─ Click "Change Password"
├─ Enter current password
├─ Enter new password
├─ Confirm new password
├─ POST /api/student/update-password
├─ Server validates current password
├─ Encrypts new password with bcrypt
├─ Saves to database
└─ Logout & login with new password

FORGOT PASSWORD:
├─ On login, click "Forgot Password?"
├─ Enter email
├─ POST /api/student/forget-password
├─ Backend creates reset token
├─ Stores in ResetPasswordToken collection
├─ Sends email with reset link (if email configured)
├─ Student clicks link or uses reset form
├─ Enter new password
├─ POST /api/student/update-password/{resetId}
├─ Password updated
├─ Redirect to login
└─ Login with new password
```

---

## Data Management Flow

### Request-Response Lifecycle

```
DETAILED STEP-BY-STEP FLOW FOR ANY API CALL:

1. USER INTERACTION (Frontend)
   └─ Click button → React event handler → Function call

2. DATA PREPARATION (Frontend)
   ├─ Collect form data
   ├─ Validate (non-empty, correct type, length)
   ├─ Prepare request object:
   │  {
   │    name: "John Doe",
   │    email: "john@college.com",
   │    branch: "CSE"
   │  }
   └─ Show loading spinner

3. AXIOS WRAPPER REQUEST (Frontend)
   ├─ Call: axiosWrapper.post('/api/student', data)
   ├─ INTERCEPTOR RUNS:
   │  ├─ Get token from localStorage
   │  ├─ Add Authorization header
   │  └─ Return modified config
   └─ Make HTTP request:
      {
        url: "http://localhost:4000/api/student",
        method: "POST",
        data: { name, email, branch },
        headers: {
          Authorization: "Bearer eyJhbGc...",
          Content-Type: "application/json"
        }
      }

4. NETWORK TRANSMISSION
   └─ HTTP POST request sent over network
      └─ Reaches backend on port 4000

5. BACKEND ROUTING (Express)
   ├─ Express receives request
   ├─ Routes.js matches method+path:
   │  router.post('/student', controller)
   └─ Calls controller function

6. MIDDLEWARE PROCESSING
   ├─ Multer (if file upload):
   │  ├─ Parse multipart/form-data
   │  ├─ Save file to /media
   │  └─ Add filename to req.body
   └─ Auth Middleware:
      ├─ Extract token from header
      ├─ Verify JWT signature
      ├─ Check expiration
      ├─ If invalid → return 401 error
      └─ If valid → attach user to req.user

7. CONTROLLER EXECUTION (Business Logic)
   └─ studentController.registerStudent()
      ├─ Input validation:
      │  ├─ Check required fields
      │  ├─ Check email format
      │  ├─ Check if email already exists
      │  └─ If failed → throw error
      ├─ Password encryption (if applicable):
      │  └─ bcryptjs.hash(password, 10)
      ├─ Database operation:
      │  ├─ connection.collection('students').insertOne({
      │  │    name: "John Doe",
      │  │    email: "john@college.com",
      │  │    branch: "CSE",
      │  │    password: "hashed_password",
      │  │    createdAt: new Date(),
      │  │    ...
      │  │  })
      │  └─ Returns result
      ├─ Response formatting:
      │  └─ ApiResponse.success(...)
      └─ Return response object

8. RESPONSE GENERATION
   └─ ApiResponse.success().send(res)
      ├─ Creates response object:
      │  {
      │    success: true,
      │    message: "Student registered successfully",
      │    data: {
      │      _id: "507f1f77bcf86cd799439011",
      │      name: "John Doe",
      │      email: "john@college.com",
      │      branch: "CSE"
      │    }
      │  }
      ├─ Set HTTP status: 201
      └─ Send response over network

9. NETWORK TRANSMISSION (Response)
   └─ HTTP response sent back to frontend

10. AXIOS RESPONSE INTERCEPTOR (Frontend)
    ├─ Receives response
    ├─ Check status code (200-299)
    ├─ Check response.success:
    │  ├─ If success === true → continue
    │  ├─ If success === false → throw error
    │  └─ If token expired (401) → redirect login
    └─ Return response

11. COMPONENT HANDLING (Frontend)
    ├─ .then(response => {
    │  ├─ Extract data: const student = response.data.data
    │  ├─ Redux dispatch (save to store)
    │  ├─ Show success toast
    │  ├─ Update local state
    │  ├─ Clear form
    │  └─ Redirect to list page
    │  })
    ├─ .catch(error => {
    │  ├─ Check error type
    │  ├─ Show error toast with message
    │  ├─ Keep form filled (for retry)
    │  └─ Log to console for debugging
    │  })
    └─ Hide loading spinner

12. UI UPDATE (React Re-render)
    ├─ Component state changed
    ├─ Redux store updated
    ├─ Component re-renders
    ├─ New data displayed
    └─ User sees success

COMPLETE FLOW RESULT:
└─ New student added to MongoDB
   └─ Visible in frontend list immediately
      └─ Available for all other operations
```

---

## File Upload Flow

### Complete File Upload Process

```
USER UPLOADS FILE:
    ↓
1. FRONTEND - USER SELECTS FILE
   ├─ <input type="file" onChange={handleFileSelect} />
   ├─ File selected: { name, size, type, ... }
   └─ Preview shown to user

2. FRONTEND - FORM SUBMISSION
   ├─ Create FormData object:
   │  const formData = new FormData()
   │  formData.append('title', 'Chapter 1')
   │  formData.append('subject', '507f1f77bcf86cd799439011')
   │  formData.append('file', file) // Binary data
   │
   ├─ Call AxiosWrapper:
   │  axiosWrapper.post('/api/material', formData, {
   │    headers: {
   │      'Content-Type': 'multipart/form-data',
   │      'Authorization': `Bearer ${token}`
   │    }
   │  })
   └─ Show upload progress

3. NETWORK - TRANSMISSION
   ├─ HTTP POST with multipart/form-data
   └─ File sent as binary chunks

4. BACKEND - MULTER MIDDLEWARE
   ├─ Express receives multipart request
   ├─ Multer intercepts:
   │  ├─ Validates Content-Type: multipart/form-data ✓
   │  ├─ For each file part:
   │  │  ├─ Check file type (.pdf, .doc, .pptx allowed)
   │  │  ├─ Check file size (max 50MB typically)
   │  │  ├─ Generate filename with timestamp:
   │  │  │  └─ "1771650830681.pdf"
   │  │  ├─ Save to /media directory:
   │  │  │  └─ /media/1771650830681.pdf
   │  │  └─ Add to req.files or req.file
   │  │
   │  ├─ For each form field (title, subject):
   │  │  └─ Add to req.body:
   │  │     {
   │  │       title: 'Chapter 1',
   │  │       subject: '507f1f77bcf86cd799439011',
   │  │       file: {
   │  │         filename: '1771650830681.pdf',
   │  │         path: '/media/1771650830681.pdf',
   │  │         size: 2048576
   │  │       }
   │  │     }
   │  └─ Pass to next middleware
   └─ Continue to auth middleware

5. BACKEND - AUTH MIDDLEWARE
   ├─ Verify JWT token
   ├─ Attach user info to req
   └─ Continue to controller

6. BACKEND - CONTROLLER LOGIC
   ├─ Validate req.body fields
   ├─ Validate file exists: req.file ✓
   ├─ Database operation:
   │  Material.create({
   │    title: "Chapter 1",
   │    subject: ObjectId("..."),
   │    filePath: "/media/1771650830681.pdf",
   │    fileName: "1771650830681.pdf",
   │    fileSize: 2048576,
   │    mimeType: "application/pdf",
   │    uploadedBy: userId,
   │    uploadedAt: new Date()
   │  })
   ├─ Document saved to MongoDB
   └─ Return success response

7. BACKEND - RESPONSE
   {
     success: true,
     message: "Material uploaded successfully",
     data: {
       _id: "507f1f77bcf86cd799439012",
       title: "Chapter 1",
       fileName: "1771650830681.pdf",
       filePath: "/media/1771650830681.pdf",
       uploadedAt: "2026-03-14T10:30:00.000Z"
     }
   }

8. FRONTEND - RESPONSE HANDLING
   ├─ Response received
   ├─ Check success: true ✓
   ├─ Extract fileData
   ├─ Show toast: "Upload successful!"
   ├─ Update material list
   ├─ New material appears in table
   └─ User can see:
      ├─ Material title ✓
      ├─ Upload date ✓
      ├─ Download button ✓
      └─ Leading to /media/1771650830681.pdf

9. STUDENT DOWNLOADS
   ├─ Clicks download button
   ├─ Browser navigates to:
   │  http://localhost:4000/media/1771650830681.pdf
   ├─ Express serves file from /media directory
   ├─ Content-Type: application/pdf
   ├─ File downloaded to Downloads folder
   └─ Student can open & read

FILE STORAGE STRUCTURE:
├─ /backend
│  ├─ /media
│  │  ├─ 1771650830681.pdf (Chapter 1)
│  │  ├─ 1771651203241.txt (Study notes)
│  │  ├─ 1771651567890.docx (Assignment)
│  │  └─ ... more files
│  ├─ app.js (serves /media as static)
│  └─ ...
│
└─ MongoDB
   └─ materials collection
      ├─ { filePath: "/media/1771650830681.pdf", ... }
      ├─ { filePath: "/media/1771651203241.txt", ... }
      └─ ...

KEY EXPRESS CONFIGURATION:
├─ app.use(express.static('media'))
├─ Serves files from /media directory at:
│  └─ GET /media/filename.ext
└─ Students access via: /media/1771650830681.pdf
```

---

## Real-time Update Flow

### How Changes Appear Immediately

```
SCENARIO: Admin adds new student

1. ADMIN FORM → POST /api/student/register
   ├─ Student created in MongoDB
   └─ Response sent: { success: true, data: {...} }

2. FRONTEND - IMMEDIATE UPDATE
   ├─ Toast shows: "Student added!"
   ├─ Component state cleared
   ├─ Automatically calls: GET /api/student
   ├─ Fetches updated list including new student
   └─ Components re-render with full list

3. OTHER ADMINS SEE CHANGE
   ├─ Scenario: 2 admins in same app
   ├─ Admin A adds student
   ├─ Admin B doesn't refresh page
   ├─ Admin B DOESN'T see new student
   │  └─ (No server-side WebSocket push)
   ├─ BUT when Admin B clicks refresh/reload
   └─ New data appears

BACKEND CACHING:
└─ NO caching currently
   ├─ Every GET request queries fresh from MongoDB
   ├─ Latest data always returned
   └─ Perfect for small-medium scale

UPDATING EXISTING RECORD:

1. Admin edits student details
   ├─ PATCH /api/student/:id
   ├─ {
   │    name: "Updated Name",
   │    phone: "9876543210"
   │  }
   └─ Sent to server

2. Backend updates MongoDB
   ├─ Find student by _id
   ├─ Update fields
   ├─ Return updated document
   └─ Response: { success: true, data: {...} }

3. Frontend shows changes
   ├─ Close edit form
   ├─ Re-fetch list: GET /api/student
   ├─ Updated student shown in list
   └─ All fields reflected

DELETING RECORD:

1. Admin clicks delete
   ├─ Confirm dialog: "Are you sure?"
   ├─ User confirms
   └─ DELETE /api/student/:id

2. Backend deletes from MongoDB
   ├─ Find student by _id
   ├─ Remove from collection
   ├─ Check success
   └─ Return: { success: true }

3. Frontend updates UI
   ├─ Toast: "Student deleted successfully"
   ├─ Remove from local list OR re-fetch
   ├─ Student disappears
   └─ UI consistent with database

CONSISTENCY:
└─ Frontend = MongoDB always
   ├─ No stale data
   ├─ Always fetch fresh after changes
   ├─ Single source of truth: MongoDB
   └─ No offline mode (always connected)
```

---

## Error Handling Flow

### Complete Error Management

```
ERROR SCENARIOS & HANDLING:

1. VALIDATION ERROR (Frontend)
   ├─ User doesn't fill required field
   ├─ Frontend validation catches
   ├─ Shows error message: "Name is required"
   ├─ Form not submitted
   ├─ No API call made
   └─ User corrects before sending

2. VALIDATION ERROR (Backend)
   ├─ Frontend sent incomplete data
   ├─ Backend validation:
   │  if (!name) {
   │    return ApiResponse.badRequest("Name required").send(res)
   │  }
   ├─ Response: { success: false, message: "...", data: null }
   ├─ HTTP Status: 400
   ├─ Frontend receives error ✓
   ├─ Toast shows: "Name required"
   ├─ Form stays open
   └─ User corrects & retries

3. DUPLICATE ERROR
   ├─ Student tries to add email that exists
   ├─ Backend check:
   │  const existing = await Student.findOne({ email })
   │  if (existing) {
   │    return ApiResponse.badRequest("Email already exists")
   │  }
   ├─ Response: { success: false, message: "..." }
   ├─ Frontend shows: "This email is already registered"
   ├─ User uses different email
   └─ Retry succeeds

4. DATABASE ERROR
   ├─ MongoDB connection fails
   ├─ Query throws error
   ├─ Controller catches:
   │  try {
   │    const result = await Model.find()
   │  } catch(err) {
   │    return ApiResponse.internalError("Database error")
   │  }
   ├─ Response: { success: false, message: "Database error" }
   ├─ HTTP Status: 500
   ├─ Frontend shows: "Server error. Please try again"
   ├─ User retries
   └─ If persists: Admin checks MongoDB connection

5. AUTHENTICATION ERROR
   ├─ User not logged in
   ├─ Tries to access protected route: /admin/student
   ├─ Route uses ProtectedRoute component:
   │  {
   │    userToken in localStorage? No
   │    Redirect('/login')
   │  }
   ├─ User sent to login page
   ├─ User logs in
   └─ Can access protected route

6. TOKEN EXPIRED
   ├─ User logged in 1+ hours ago
   ├─ Makes API call with old token
   ├─ Backend auth middleware:
   │  jwt.verify(token, SECRET)
   │  → Error: "Token expired"
   ├─ Response: 403 error
   ├─ Frontend interceptor catches 403:
   │  ├─ localStorage.removeItem("userToken")
   │  ├─ Redux clear user data
   │  ├─ Redirect to '/login'
   │  └─ Show: "Session expired. Please login again"
   ├─ User re-logs in
   ├─ New token generated (1 hour)
   └─ Can use app again

7. INVALID TOKEN
   ├─ Token tampered with or corrupted
   ├─ Backend: jwt.verify(token) throws error
   ├─ Auth middleware catches
   ├─ Returns 401 Unauthorized
   ├─ Frontend:
   │  ├─ Clear localStorage
   │  ├─ Redirect to login
   │  └─ Show: "Authentication failed. Please login"
   ├─ User logs in fresh
   └─ Works normally

8. FILE UPLOAD ERROR
   ├─ File too large (> 50MB)
   ├─ Multer rejects:
   │  └─ Error: "File too large"
   ├─ Response: 400 error
   ├─ Frontend shows: "File size too large"
   ├─ User selects smaller file
   └─ Retry succeeds

9. WRONG FILE TYPE
   ├─ User uploads .exe (malicious)
   ├─ Multer checks mime type:
   │  if (!['application/pdf', 'application/msword'].includes(file.type))
   ├─ Rejects file
   ├─ Response: 400 "Invalid file type"
   ├─ Frontend: "Only PDF/DOC files allowed"
   ├─ User uploads PDF
   └─ Success

10. NETWORK ERROR (Internet disconnected)
    ├─ User has connection, makes API call
    ├─ Connection drops during request
    ├─ Axios rejects: "Network Error"
    ├─ Frontend:
    │  ├─ Catch block executes
    │  ├─ Show: "Network error. Check connection"
    │  ├─ Keep loading state off
    │  └─ Keep form filled (for retry)
    ├─ User reconnects to internet
    ├─ Clicks "Retry"
    └─ Request sent again, succeeds

11. PERMISSION ERROR
    ├─ Student tries to delete another student
    ├─ DELETE /api/student/OTHER_ID
    ├─ Backend checks:
    │  ├─ Is user student? Yes
    │  ├─ Are they deleting themselves? No
    │  ├─ Permission denied
    │  └─ Return: 403 error
    ├─ Frontend: "You don't have permission"
    ├─ User cannot perform action
    └─ Attempted action blocked

GLOBAL ERROR HANDLING:
└─ Try-Catch in Controllers:
   try {
     // Business logic
   } catch(error) {
     console.error(error)
     return ApiResponse.internalError(
       error.message || "Operation failed"
     ).send(res)
   }
```

---

## Database Schema & Relations

### Complete Data Model

```
MONGODB COLLECTIONS & STRUCTURE:

1. STUDENTS COLLECTION
   ├─ _id (ObjectId, unique)
   ├─ name (String)
   ├─ email (String, unique)
   ├─ password (String, hashed with bcrypt)
   ├─ phone (String)
   ├─ rollNumber (String, unique)
   ├─ branch (ObjectId, references Branch)
   ├─ semester (Number: 1-8)
   ├─ address (String)
   ├─ dob (Date)
   ├─ gender (String: M/F)
   ├─ profileImage (String: filename path)
   ├─ emergencyContact (String)
   ├─ createdAt (Date)
   ├─ updatedAt (Date)
   └─ __v (Number, version)

2. FACULTY COLLECTION
   ├─ _id (ObjectId, unique)
   ├─ name (String)
   ├─ email (String, unique)
   ├─ password (String, hashed)
   ├─ phone (String)
   ├─ department (String)
   ├─ designation (String)
   ├─ subjects (Array of ObjectId, references Subject)
   ├─ qualifications (String)
   ├─ experience (Number)
   ├─ profileImage (String)
   ├─ officeLocation (String)
   ├─ createdAt (Date)
   ├─ updatedAt (Date)
   └─ __v (Number)

3. ADMIN COLLECTION
   ├─ _id (ObjectId, unique)
   ├─ name (String)
   ├─ email (String, unique)
   ├─ password (String, hashed)
   ├─ phone (String)
   ├─ role (String: Admin/SuperAdmin)
   ├─ permissions (Array of Strings)
   ├─ createdAt (Date)
   ├─ updatedAt (Date)
   └─ __v (Number)

4. BRANCH COLLECTION
   ├─ _id (ObjectId, unique)
   ├─ name (String: CSE, ECE, ME, etc.)
   ├─ code (String: unique)
   ├─ description (String)
   ├─ totalSemesters (Number)
   ├─ totalSeats (Number)
   ├─ hod (String)
   ├─ createdAt (Date)
   ├─ updatedAt (Date)
   └─ __v (Number)

5. SUBJECT COLLECTION
   ├─ _id (ObjectId, unique)
   ├─ name (String)
   ├─ code (String, unique)
   ├─ branch (ObjectId, references Branch)
   ├─ semester (Number: 1-8)
   ├─ totalMarks (Number)
   ├─ creditHours (Number)
   ├─ faculty (ObjectId, references Faculty - optional)
   ├─ description (String)
   ├─ createdAt (Date)
   ├─ updatedAt (Date)
   └─ __v (Number)

6. ATTENDANCE COLLECTION
   ├─ _id (ObjectId, unique)
   ├─ student (ObjectId, references Student)
   ├─ branch (ObjectId, references Branch)
   ├─ semester (Number)
   ├─ date (Date)
   ├─ status (String: present/absent/leave)
   ├─ subject (ObjectId, references Subject - optional)
   ├─ markedBy (ObjectId, references Faculty - optional)
   ├─ createdAt (Date)
   ├─ updatedAt (Date)
   └─ __v (Number)

7. MARKS COLLECTION
   ├─ _id (ObjectId, unique)
   ├─ student (ObjectId, references Student)
   ├─ subject (ObjectId, references Subject)
   ├─ exam (String: Mid-Semester/Final/Quiz)
   ├─ marksObtained (Number)
   ├─ totalMarks (Number)
   ├─ percentage (Number)
   ├─ grade (String: A/B/C/D/F - optional)
   ├─ semester (Number)
   ├─ enteredBy (ObjectId, references Faculty)
   ├─ createdAt (Date)
   ├─ updatedAt (Date)
   └─ __v (Number)

8. MATERIAL COLLECTION
   ├─ _id (ObjectId, unique)
   ├─ title (String)
   ├─ description (String)
   ├─ subject (ObjectId, references Subject)
   ├─ semester (Number)
   ├─ filePath (String: /media/filename.ext)
   ├─ fileName (String)
   ├─ fileSize (Number)
   ├─ mimeType (String: application/pdf, etc.)
   ├─ uploadedBy (ObjectId, references Faculty)
   ├─ downloads (Number: download count)
   ├─ createdAt (Date)
   ├─ updatedAt (Date)
   └─ __v (Number)

9. EXAM COLLECTION
   ├─ _id (ObjectId, unique)
   ├─ name (String)
   ├─ subject (ObjectId, references Subject)
   ├─ branch (ObjectId, references Branch)
   ├─ semester (Number)
   ├─ startDate (Date)
   ├─ endDate (Date)
   ├─ time (String: 09:00-12:00)
   ├─ room (String)
   ├─ totalSeats (Number)
   ├─ document (String: /media/exam_schedule.pdf)
   ├─ type (String: Mid/Final/Quiz)
   ├─ createdAt (Date)
   ├─ updatedAt (Date)
   └─ __v (Number)

10. TIMETABLE COLLECTION
    ├─ _id (ObjectId, unique)
    ├─ branch (ObjectId, references Branch)
    ├─ semester (Number)
    ├─ schedule (Array of:
    │  ├─ day (String: Monday, Tuesday, etc.)
    │  ├─ time (String: 09:00-10:00)
    │  ├─ subject (ObjectId, references Subject)
    │  ├─ room (String)
    │  ├─ faculty (ObjectId, references Faculty)
    │  └─ building (String)
    │ )
    ├─ document (String: /media/timetable.pdf)
    ├─ effectiveFrom (Date)
    ├─ createdAt (Date)
    ├─ updatedAt (Date)
    └─ __v (Number)

11. NOTICE COLLECTION
    ├─ _id (ObjectId, unique)
    ├─ title (String)
    ├─ description (String)
    ├─ content (String)
    ├─ priority (String: High/Medium/Low)
    ├─ issueDate (Date)
    ├─ deadline (Date - optional)
    ├─ targetAudience (String: All/Faculty/Students/Specific)
    ├─ attachment (String: /media/filename - optional)
    ├─ createdBy (ObjectId, references Admin)
    ├─ isActive (Boolean)
    ├─ createdAt (Date)
    ├─ updatedAt (Date)
    └─ __v (Number)

RELATIONSHIPS (ERD):
└─ Student
   ├─ 1-to-1 → Branch (student.branch → branch._id)
   ├─ 1-to-Many → Attendance (student._id ← attendance.student)
   ├─ 1-to-Many → Marks (student._id ← marks.student)
   └─ N-to-N → Subject (through Marks & Attendance)

└─ Faculty
   ├─ 1-to-Many → Subject (as instructor)
   ├─ 1-to-Many → Attendance (marked by)
   ├─ 1-to-Many → Marks (entered by)
   ├─ 1-to-Many → Material (uploaded by)
   └─ N-to-N → Timetable (assigned in schedule)

└─ Subject
   ├─ M-to-1 → Branch (multiple subjects per branch)
   ├─ M-to-1 → Faculty (assigned faculty instructor)
   ├─ 1-to-Many → Marks (recorded marks per subject)
   ├─ 1-to-Many → Material (study materials for subject)
   └─ 1-to-Many → Attendance (tracked per subject)
```

---

## Complete Use Cases

### Use Case 1: Complete Admission Workflow

```
SCENARIO: Admitting a new student

STEP 1: Admin Dashboard (Login)
├─ Visit: http://localhost:3000
├─ Select: Student/Faculty/Admin (select Admin)
├─ Email: admin@college.com
├─ Password: admin123
├─ Click: Login
|
└─ POST /api/admin/login
   ├─ Verify credentials
   ├─ Generate JWT token
   ├─ Return token + admin details
   ├─ Frontend stores token
   ├─ Redirects to: /admin (dashboard)
   └─ Shows admin dashboard with stats

STEP 2: Navigate to Student Management
├─ Click: "Student" in sidebar
├─ GET /api/student
├─ Shows all current students in list/table
├─ Admin sees count, list, search options

STEP 3: Add New Student
├─ Click: "Add Student" button
├─ Form opens with fields:
│  ├─ Name (required)
│  ├─ Email (unique)
│  ├─ Phone
│  ├─ Roll Number (unique)
│  ├─ Branch (dropdown)
│  ├─ Semester (1-8)
│  ├─ Address
│  ├─ DOB (date picker)
│  ├─ Gender (M/F)
│  ├─ Profile Photo (file upload)
│  ├─ Emergency Contact
│  └─ Initial Password (auto-generated or entered)

STEP 4: Fill & Submit
├─ Admin fills all fields
├─ Selects profile photo: student_photo.jpg
├─ Click: "Submit"
├─ Frontend validates:
│  ├─ All required fields filled ✓
│  ├─ Email format valid ✓
│  ├─ Phone is numeric ✓
│  └─ File is image ✓
├─ Show loading spinner

STEP 5: Backend Processing
├─ POST /api/student/register with FormData
│  ├─ Email: john@college.com
│  ├─ Name: John Doe
│  ├─ Phone: 9876543210
│  ├─ Branch: 507f1f77bcf86cd799439011 (CSE)
│  ├─ Semester: 1
│  ├─ Photo: binary file data
│  └─ Other fields...

STEP 6: Multer File Processing
├─ Intercepts multipart request
├─ Validates image file
├─ Generates timestamp: 1771650830681
├─ Saves to: /backend/media/1771650830681.jpg
├─ Returns filename to controller

STEP 7: Database Operation
├─ Controller validates inputs
├─ Hash password: bcryptjs.hash(password, 10)
├─ Check email unique: already exists? No ✓
├─ Insert to MongoDB:
│  db.students.insertOne({
│    name: "John Doe",
│    email: "john@college.com",
│    password: "$2a$10$...", // hashed
│    phone: "9876543210",
│    rollNumber: "CSE001",
│    branch: ObjectId("507f1f77bcf86cd799439011"),
│    semester: 1,
│    profileImage: "/media/1771650830681.jpg",
│    createdAt: new Date()
│  })
├─ Document created with _id
└─ Return success response

STEP 8: Frontend Response
├─ Response received: {
│  success: true,
│  message: "Student registered successfully",
│  data: { _id: "...", name: "John Doe", ... }
│ }
├─ Toast shows: "✅ Student added successfully!"
├─ Form clears
├─ Modal closes

STEP 9: Update Student List
├─ Component calls: GET /api/student
├─ Backend returns updated list
├─ RE-RENDERS with new student
├─ New student appears in table:
│  │ Roll | Name | Email | Branch | Semester |
│  ├─────┼──────┼───────┼────────┼──────────┤
│  │CSE01│ John │@col.. │  CSE   │    1     │
│  └─────┴──────┴───────┴────────┴──────────┘

✅ STUDENT SUCCESSFULLY ADMITTED
   - Account created
   - Can now login with: john@college.com / password
   - Appears in system
   - Ready for course enrollment
```

### Use Case 2: Faculty Uploads Marks Workflow

```
SCENARIO: Faculty uploads marks for end-semester exam

STEP 1: Faculty Login
├─ Visit: http://localhost:3000
├─ Select: Faculty
├─ Email: faculty@college.com
├─ Password: faculty123
├─ POST /api/faculty/login
├─ Get token + faculty details
├─ Redirected to: /faculty (dashboard)

STEP 2: Navigate to Marks Upload
├─ Click: "Upload Marks" button
├─ Or: Go to /faculty/marks
├─ Component: UploadMarks.jsx loads

STEP 3: Select Exam Details
├─ Form with dropdowns:
│  ├─ Branch: (CSE selected)
│  ├─ Subject: "Data Structures" selected
│  ├─ Semester: 3 selected
│  ├─ Exam Type: "Final Exam" selected
│  └─ Total Marks: 100 (auto-filled from subject)

STEP 4: Choose Upload Method
┌─ OPTION A: Upload CSV file ─┐
│
│ CSV Format:
│ ┌──────────────────┬────────┐
│ │ StudentEmail     │ Marks  │
│ ├──────────────────┼────────┤
│ │ student1@col.com │   85   │
│ │ student2@col.com │   92   │
│ │ student3@col.com │   78   │
│ └──────────────────┴────────┘
│
│ Faculty:
│ ├─ Click "Upload File"
│ ├─ Select marks_file.csv
│ ├─ File preview shown
│ └─ Validates format

└────────────────────────────────┘

OR

┌─ OPTION B: Enter Manually ─┐
│
│ GET /api/student?branch=CSE&semester=3
│ Returns: List of 50 students
│
│ Display form with rows:
│ ┌────────────────┬──────────┐
│ │ Student Name   │ Marks    │
│ ├────────────────┼──────────┤
│ │ John Doe       │ [85]     │
│ │ Jane Smith     │ [92]     │
│ │ Mike Johnson   │ [78]     │
│ └────────────────┴──────────┘
│
│ Faculty enters marks manually
│ Validates: 0 ≤ marks ≤ 100

└────────────────────────────────┘

STEP 5: Submit Marks
├─ Click: "Upload" button
├─ Show loading spinner
├─ Prepare data:
│  {
│    subject: ObjectId("507f1f77..."),
│    exam: "Final",
│    semester: 3,
│    branch: ObjectId("507f1f..."),
│    marks: [
│      { studentId: "600...", marksObtained: 85 },
│      { studentId: "601...", marksObtained: 92 },
│      { studentId: "602...", marksObtained: 78 }
│    ]
│  }

STEP 6: Backend Bulk Upload
├─ POST /api/marks/bulk
│
├─ Validate:
│  ├─ All marks between 0-100 ✓
│  ├─ All students exist ✓
│  ├─ Subject exists ✓
│  ├─ No duplicate entries ✓
│
├─ Database Operation:
│  ├─ For each student's marks:
│  │  ├─ Find/create marks document
│  │  ├─ Update: marksObtained
│  │  ├─ Calculate: percentage = (85/100)*100
│  │  ├─ Assign: grade (A: 85+, B: 70-84, etc.)
│  │  └─ Save to MongoDB
│  │
│  └─ Return result: {
│     success: true,
│     message: "50 marks uploaded successfully",
│     data: {
│       processedRecords: 50,
│       failedRecords: 0
│     }
│   }

STEP 7: Frontend Success
├─ Toast: "✅ 50 marks uploaded successfully!"
├─ Form clears
├─ Redirect to marks list view
├─ Marks visible in system

STEP 8: Student Views Marks
├─ Student goes to: /student/marks
├─ GET /api/marks/student
├─ Sees results:
│  ┌─────────────────┬────┬──────┬────────┐
│  │ Subject         │Mar │Total │% (Gr  │
│  ├─────────────────┼────┼──────┼────────┤
│  │ Data Structures │ 85 │ 100  │ 85%(A) │
│  │ Algorithms      │ 92 │ 100  │ 92%(A) │
│  │ Database        │ 78 │ 100  │ 78%(B) │
│  └─────────────────┴────┴──────┴────────┘

✅ MARKS UPLOADED & VISIBLE
   - Faculty mark submission complete
   - Stored in MongoDB
   - Students can view immediately
```

### Use Case 3: Student Checking Attendance Workflow

```
SCENARIO: Student checking attendance & percentage

STEP 1: Student Login
├─ Visit: http://localhost:3000/login
├─ Select: Student
├─ Email: student@college.com
├─ Password: student123
├─ POST /api/student/login
├─ Redirected to: /student (dashboard)

STEP 2: Dashboard Display
├─ Shows attendance % at a glance
├─ Example: "📊 Attendance: 82%"
├─ Pie chart showing attendance ratio
├─ If < 75%: Warning badge shown
├─ Quick link: "View Details"

STEP 3: Click Attendance
├─ Component: Attendance.jsx loads
├─ GET /api/attendance/student
│
│ Backend returns:
│ {
│   success: true,
│   data: {
│     total: 100,
│     present: 82,
│     absent: 18,
│     leave: 0,
│     percentage: 82,
│     records: [
│       { date: "2026-03-14", status: "present" },
│       { date: "2026-03-13", status: "absent" },
│       ...
│     ]
│   }
│ }

STEP 4: Display Attendance Details
├─ Show statistics:
│  ├─ Total Classes: 100
│  ├─ Classes Attended: 82
│  ├─ Classes Missed: 18
│  ├─ Attendance %: 82%
│  └─ Status: ✅ Good (>75%)

├─ Show calendar view:
│  ┌──────────────────────┐
│  │ March 2026           │
│  ├──────────────────────┤
│  │ M  T  W  T  F  S  S  │
│  │ .. .. ✓  ✓  ✗  ✓  .. │
│  │ ✓  ✓  ✓  ✗  ✓  ✓  .. │
│  └──────────────────────┘
│
│ Legend:
│  ✓ = Present (green)
│  ✗ = Absent (red)
│  .. = No class

├─ Show detailed list:
│  ┌────────────┬────────┐
│  │ Date       │ Status │
│  ├────────────┼────────┤
│  │ 2026-03-14 │Present │
│  │ 2026-03-13 │ Absent │
│  │ 2026-03-12 │Present │
│  └────────────┴────────┘

STEP 5: Download Report (Optional)
├─ Click: "Download PDF"
├─ Generates PDF with:
│  ├─ Student name & roll no
│  ├─ Attendance table
│  ├─ Overall percentage
│  └─ Month-wise breakdown
├─ File: attendance_report.pdf
├─ Downloaded by student

✅ ATTENDANCE INFORMATION REVIEWED
   - Student knows current attendance
   - Sees day-by-day record
   - Can monitor percentage
   - Gets warning if low
```

---

## Summary of Complete Flow

### End-to-End Data Journey

```
USER → FRONTEND → BACKEND → DATABASE → BACKEND → FRONTEND → DISPLAY

1️⃣ USER INTERACTS
   Click button/submit form
   
2️⃣ FRONTEND PROCESSES
   Validate input
   Prepare request data
   
3️⃣ AXIOSWRAPPER INTERCEPTS
   Add JWT token automatically
   Add proper headers
   
4️⃣ HTTP REQUEST SENT
   POST/GET/PATCH/DELETE
   With token in Authorization header
   
5️⃣ BACKEND ROUTE MATCHED
   Express finds matching route
   
6️⃣ MIDDLEWARE PROCESSES
   Multer: uploads files
   Auth: verifies token
   
7️⃣ CONTROLLER EXECUTES
   Validates business logic
   
8️⃣ DATABASE OPERATION
   MongoDB query/update/create/delete
   Data persisted
   
9️⃣ RESPONSE FORMATTED
   ApiResponse standardized format
   {success, message, data}
   
🔟 FRONTEND INTERCEPTOR
    Checks response validity
    
1️⃣1️⃣ COMPONENT UPDATES
    Redux store updated
    
1️⃣2️⃣ UI RE-RENDERS
    Users see result
    
1️⃣3️⃣ TOAST NOTIFICATION
    Success/error message
    
1️⃣4️⃣ READY FOR NEXT ACTION
    User can perform another operation
```

---

## Conclusion

This College Management System provides:

✅ **Complete Student Management**
   - Admission to graduation
   - Attendance tracking
   - Marks recording & viewing

✅ **Complete Faculty Operations**
   - Attendance marking
   - Marks upload (bulk & individual)
   - Material distribution

✅ **Complete Admin Control**
   - Dashboard with statistics
   - Manage students/faculty/subjects/branches
   - Exam & notice management

✅ **Secure Authentication**
   - JWT-based with 1-hour expiration
   - Password encryption
   - Role-based access control

✅ **Real-time Data**
   - No stale data
   - Instant updates
   - MongoDB as single source of truth

✅ **File Management**
   - Upload materials/exams/timetables
   - Organized storage in /media
   - Student downloads available

✅ **Comprehensive Error Handling**
   - Validation at every level
   - User-friendly error messages
   - Graceful failure recovery

---

**Version**: 1.0  
**Last Updated**: March 14, 2026  
**Status**: Complete & Production Ready ✅
