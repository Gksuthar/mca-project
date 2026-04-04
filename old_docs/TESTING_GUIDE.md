# MERN Stack College Management System - Setup & Testing Guide

## 📚 Project Overview

This is a comprehensive College Management System built with MERN Stack (MongoDB, Express, React, Node.js) featuring role-based access control for Admin, Faculty, and Students.

---

## 🚀 QUICK START

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
# Server will run on http://localhost:4000
```

### Frontend Setup

```bash
# Navigate to frontend (in another terminal)
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
# Frontend will run on http://localhost:3000 (Vite)
```

---

## 🔑 Test Credentials

### Admin Login
- **Email**: admin@college.com
- **Password**: admin123
- **Role**: Admin

### Faculty Login
- **Email**: faculty@college.com
- **Password**: faculty123
- **Role**: Faculty

### Student Login
- **Email**: student@college.com
- **Password**: student123
- **Role**: Student

*Note: Create test users via seeding or manually in MongoDB*

---

## 📊 Database Setup

### MongoDB Connection

1. **Local MongoDB**: 
   - Default connection: `mongodb://127.0.0.1:27017/College`
   - Ensure MongoDB is running locally

2. **MongoDB Atlas (Cloud)**:
   - Update `.env` with your MongoDB Atlas URI
   - `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/College`

### Database Seeding

```bash
cd backend

# Seed initial data
npm run seed

# Seed admin user
npm run seed:admin
```

---

## ✅ COMPREHENSIVE TESTING CHECKLIST

### Admin Role Testing

#### Dashboard & Statistics
- [ ] Admin Dashboard shows correct student/faculty/branch/subject counts
- [ ] Live update of statistics when new records added
- [ ] Charts and graphs render correctly

#### Student Management
- [ ] View all students
- [ ] Search students by enrollment number, name, semester, branch
- [ ] Add new student (requires profile image)
- [ ] Edit student details
- [ ] Delete student (with confirmation)
- [ ] Data persists after page refresh
- [ ] Form validation works properly

#### Faculty Management
- [ ] View all faculty members
- [ ] Add new faculty member
- [ ] Edit faculty details
- [ ] Delete faculty member
- [ ] Assign branch to faculty

#### Branch Management
- [ ] Add new branch
- [ ] Edit branch details (name, branch ID)
- [ ] Delete branch (if no students/subjects assigned)
- [ ] Branch appears in student/faculty registration forms

#### Subject Management
- [ ] Add subject with branch and semester
- [ ] Edit subject details
- [ ] Delete subject
- [ ] Subject appears in materials/marks management

#### Exam Management
- [ ] Add exam (name, date, semester, exam type, total marks)
- [ ] Upload timetable file
- [ ] Edit exam details
- [ ] Delete exam
- [ ] Exams appear in marks management

#### Attendance Management
- [ ] View attendance statistics by branch/semester
- [ ] Filter by date range
- [ ] Export attendance to CSV
- [ ] View detailed attendance records

#### Materials Management
- [ ] Upload materials by faculty
- [ ] Filter materials by subject/branch/semester
- [ ] Download material files

#### Notices Management
- [ ] Post notice to students/faculty
- [ ] Edit notice
- [ ] Delete notice
- [ ] Notices appear for respective roles

---

### Faculty Role Testing

#### Dashboard
- [ ] Faculty dashboard loads correctly
- [ ] Shows assigned branch/subjects
- [ ] Menu navigation works

#### Attendance Marking
- [ ] Select branch and semester
- [ ] See list of students in that branch/semester
- [ ] Mark attendance (present/absent)
- [ ] Save attendance
- [ ] View existing attendance records
- [ ] Update marked attendance
- [ ] Bulk attendance marking from CSV

#### Marks Management
- [ ] Select branch, subject, semester, exam
- [ ] See students list
- [ ] Enter marks for each student
- [ ] Validate max marks
- [ ] Bulk upload marks from Excel/CSV
- [ ] Edit existing marks
- [ ] Delete marks record

#### Material Upload
- [ ] Upload study materials (notes, assignments, syllabus)
- [ ] Assign to branch/subject/semester
- [ ] Download uploaded materials
- [ ] Edit material metadata
- [ ] Delete materials
- [ ] Filter materials by various criteria

#### Timetable View
- [ ] View timetable for assigned branch
- [ ] See schedule clearly
- [ ] Download timetable

#### Student Finder
- [ ] Search students by enrollment number, name, semester, branch
- [ ] View student details
- [ ] See student profile picture

#### Notices
- [ ] View all notices
- [ ] See notices relevant to faculty

---

### Student Role Testing

#### Dashboard
- [ ] Student dashboard loads correctly
- [ ] Shows student basic info
- [ ] Navigation menu works

#### Profile
- [ ] View personal profile information
- [ ] See enrollment number, semester, branch
- [ ] View contact information
- [ ] Change password option available

#### Attendance Viewing
- [ ] View own attendance records
- [ ] Filter by semester
- [ ] Filter by date range
- [ ] See attendance percentage
- [ ] Statistics display (total days, present, absent, percentage)

#### Marks Viewing
- [ ] View exam marks by semester
- [ ] See midterm marks
- [ ] See end-term marks
- [ ] View obtained marks vs total marks
- [ ] Filter by semester
- [ ] See subject wise marks

#### Timetable
- [ ] View class timetable
- [ ] See current semester schedule
- [ ] See room numbers and faculty names
- [ ] Download timetable

#### My Materials
- [ ] View all study materials
- [ ] Filter by subject/type
- [ ] Download materials
- [ ] See material upload date

#### Exams
- [ ] View all exams
- [ ] See exam dates and times
- [ ] Filter by semester
- [ ] Download exam timetable

#### Notices
- [ ] View all notices posted by college
- [ ] See notice date and author
- [ ] Notice contains proper description

#### Change Password
- [ ] Current password validation
- [ ] New password confirmation
- [ ] Successful password change message
- [ ] Re-login with new password works

---

## 🐛 API TESTING

### Using Postman/Thunder Client

#### 1. Authentication
```
POST /api/student/login
Body: {
  "email": "student@college.com",
  "password": "student123"
}
Response: {
  "success": true,
  "data": { "token": "eyJhbGciOiJIUzI1NiIs..." },
  "message": "Login successful"
}
```

#### 2. Protected Route Test
```
GET /api/student/my-details
Headers: {
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
Response: {
  "success": true,
  "data": { student object },
  "message": "Student Details Retrieved"
}
```

#### 3. Student Search
```
POST /api/student/search
Headers: {
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
Body: {
  "semester": 2,
  "name": "John"
}
Response: {
  "success": true,
  "data": [ { student1 }, { student2 } ],
  "message": "Students retrieved successfully"
}
```

---

## 🔍 COMMON ISSUES & SOLUTIONS

### Issue 1: "Invalid or expired token" on every request
**Solution**: 
- Clear localStorage: `localStorage.clear()`
- Re-login to get fresh token
- Check token expiration in backend JWT_SECRET

### Issue 2: File upload fails
**Solution**:
- Ensure `Content-Type: multipart/form-data` is set
- Check `/media` folder exists in backend
- Ensure multer middleware is configured

### Issue 3: CORS errors
**Solution**:
- Backend CORS should have frontend URL: `http://localhost:3000`
- Check `.env` FRONTEND_API_LINK matches

### Issue 4: Database connection fails
**Solution**:
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check MONGODB_URI in `.env`
- Verify MongoDB port 27017 is accessible

### Issue 5: Student search returns empty
**Solution**:
- Ensure students exist in database
- Check branch and semester values match
- Verify registration completed successfully with profile image

### Issue 6: Upload fails with 500 error
**Solution**:
- Check file size limits in multer middleware
- Ensure `/media` folder has write permissions
- Verify file type is allowed

---

## 📈 PERFORMANCE TESTING

### Load Testing
```bash
# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:4000/api/branch
```

### Batch Operations
- Test bulk attendance marking with 100+ students
- Test bulk marks upload with CSV
- Monitor response times and memory usage

---

## 🔐 SECURITY TESTING

### Authentication
- [ ] Token expires after 1 hour (configurable)
- [ ] Cannot access protected routes without token
- [ ] Logout clears token and redirects
- [ ] Password reset email works

### Authorization
- [ ] Admin cannot access faculty routes
- [ ] Students cannot delete other students
- [ ] Faculty cannot edit attendance of other faculty
- [ ] Role-based access strictly enforced

### Validation
- [ ] Email format validation works
- [ ] Phone number validation works (10 digits)
- [ ] Password minimum 8 characters enforced
- [ ] Duplicate enrollment numbers rejected

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Production

- [ ] Update `.env` files with production URLs
- [ ] Configure production MongoDB URI
- [ ] Set strong JWT_SECRET (not "THISISSECRET")
- [ ] Configure nodemailer with production email
- [ ] Enable HTTPS on both frontend and backend
- [ ] Update CORS to allow only production domain
- [ ] Set NODE_ENV=production
- [ ] Remove console.logs from production code
- [ ] Enable rate limiting on API
- [ ] Set up error logging service (Sentry)
- [ ] Configure automated backups for MongoDB

### Development to Production
```bash
# Build frontend for production
cd frontend
npm run build

# Start backend in production
cd backend
NODE_ENV=production npm start
```

---

## 📚 USEFUL COMMANDS

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev         # Start dev server with nodemon
npm start           # Start production server
npm run seed        # Seed initial data
npm run seed:admin  # Seed admin user
```

### Frontend
```bash
cd frontend
npm install         # Install dependencies
npm run dev         # Start dev server (Vite)
npm run build       # Build for production
npm run preview     # Preview production build
```

### Database
```bash
# MongoDB CLI
mongosh
use College
db.students.find()
db.faculty.find()
db.students.deleteMany({})  # Clear students collection
```

---

## 📞 TROUBLESHOOTING

### Getting 404 errors
1. Verify backend is running on port 4000
2. Check API endpoint path matches exactly
3. Verify token is being sent in Authorization header
4. Check VITE_API_URL in frontend .env

### Getting 401 Unauthorized
1. Token has expired - need re-login
2. Token is invalid - check JWT_SECRET matches
3. Token not being sent - check AxiosWrapper interceptor

### Getting 403 Forbidden
1. User role doesn't have access to resource
2. Check backend authorization middleware
3. Verify user role is correctly set in token

### Database errors
1. Check MongoDB is running
2. Verify MONGODB_URI is correct
3. Check database name is "College"
4. Verify collections exist with proper schema

---

## 📋 FILE STRUCTURE OVERVIEW

```
mca-project/
├── backend/
│   ├── controllers/          # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middlewares/         # Auth, file upload
│   ├── utils/               # Helper functions
│   ├── database/            # DB connection
│   ├── media/               # Uploaded files
│   ├── app.js               # Express app setup
│   ├── index.js             # Server entry point
│   └── package.json         # Dependencies
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── Screens/         # Page components
    │   ├── layouts/         # Layout wrappers
    │   ├── redux/           # State management
    │   ├── utils/           # Helper functions (AxiosWrapper)
    │   ├── App.jsx          # Main app routing
    │   └── index.jsx        # React entry point
    ├── public/              # Static files
    ├── package.json         # Dependencies
    ├── vite.config.js       # Vite configuration
    └── tailwind.config.js   # Tailwind CSS config
```

---

## ✨ KEY FEATURES CHECKLIST

- [x] JWT-based authentication for all roles
- [x] Automatic token injection in all API calls
- [x] Protected routes based on user role
- [x] Real-time data synchronization with MongoDB
- [x] File upload support (images, documents, PDFs)
- [x] Batch operations (bulk attendance, bulk marks)
- [x] Advanced search and filtering
- [x] Responsive design for all devices
- [x] Error handling and validation
- [x] Ready for production deployment

---

## 📞 Support

For issues or questions:
1. Check error messages in browser console
2. Check backend logs in terminal
3. Verify database connection
4. Review INTEGRATION_GUIDE.md for API details
5. Check Firebase/email service logs if reset email issues

---

**Last Updated**: March 13, 2026
**Status**: ✅ Ready for Testing & Deployment
