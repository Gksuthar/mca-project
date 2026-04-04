# Quick Reference Card

## 🚀 Get Started in 2 Minutes

### Backend
```bash
cd backend
npm install
npm run dev  # Runs on http://localhost:4000
```

### Frontend  
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

---

## 🔑 Test Logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.com | admin123 |
| Faculty | faculty@college.com | faculty123 |
| Student | student@college.com | student123 |

---

## 📂 Important Directories

```
backend/
├── controllers/    → Business logic
├── models/         → MongoDB schemas
├── routes/         → API endpoints
└── media/          → Uploaded files

frontend/
├── src/
│   ├── components/  → Reusable UI components
│   ├── Screens/     → Page components by role
│   ├── layouts/     → Page wrapper layouts
│   ├── redux/       → State management
│   └── utils/       → Helper functions (AxiosWrapper)
```

---

## 🔑 API Base URLs

- **Backend**: `http://localhost:4000`
- **API Routes**: `http://localhost:4000/api`
- **Media Files**: `http://localhost:4000/media`

---

## 🌍 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/College
PORT=4000
FRONTEND_API_LINK=http://localhost:3000
JWT_SECRET=THISISSECRET
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
VITE_MEDIA_URL=http://localhost:4000/media
```

---

## 🗂️ Database Collections

1. `students` - Student details
2. `faculty` - Faculty details
3. `admins` - Admin details
4. `subjects` - Subject information
5. `branches` - Branch/Department info
6. `attendance` - Attendance records
7. `marks` - Student marks
8. `materials` - Study materials
9. `exams` - Exam information
10. `timetables` - Class schedules
11. `notices` - College announcements

---

## 🔗 Main API Endpoints

### Student Management
- `GET /api/student` - Get all students
- `POST /api/student/register` - Create student
- `POST /api/student/search` - Search students
- `PATCH /api/student/:id` - Update student
- `DELETE /api/student/:id` - Delete student

### Faculty Management
- `GET /api/faculty` - Get all faculty
- `POST /api/faculty/register` - Create faculty
- `PATCH /api/faculty/:id` - Update faculty
- `DELETE /api/faculty/:id` - Delete faculty

### Marks
- `GET /api/marks` - Get marks
- `POST /api/marks` - Add marks
- `POST /api/marks/bulk` - Bulk upload marks
- `GET /api/marks/student` - Student's marks

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get attendance
- `GET /api/attendance/student` - Student attendance

### Timetable
- `GET /api/timetable` - Get timetable
- `POST /api/timetable` - Upload timetable
- `PUT /api/timetable/:id` - Update timetable

### Materials
- `GET /api/material` - Get materials
- `POST /api/material` - Upload material
- `PUT /api/material/:id` - Update material
- `DELETE /api/material/:id` - Delete material

### Exams
- `GET /api/exam` - Get exams
- `POST /api/exam` - Create exam
- `PATCH /api/exam/:id` - Update exam
- `DELETE /api/exam/:id` - Delete exam

### Notices
- `GET /api/notice` - Get notices
- `POST /api/notice` - Create notice
- `PUT /api/notice/:id` - Update notice
- `DELETE /api/notice/:id` - Delete notice

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/faculty/login` - Faculty login
- `POST /api/student/login` - Student login
- `GET /api/{role}/my-details` - Get user details
- `POST /api/{role}/forget-password` - Reset password

---

## 🎯 Feature Checklist by Role

### 👨‍💼 Admin
- [x] Dashboard with stats
- [x] Manage students (CRUD)
- [x] Manage faculty (CRUD)
- [x] Manage branches (CRUD)
- [x] Manage subjects (CRUD)
- [x] Manage exams
- [x] View attendance reports
- [x] Send notices

### 👨‍🏫 Faculty
- [x] Mark attendance
- [x] Upload marks (bulk & individual)
- [x] Upload study materials
- [x] View timetable
- [x] Find students
- [x] View profile

### 🎓 Student
- [x] View timetable
- [x] Check attendance with percentage
- [x] View marks by semester
- [x] Download materials
- [x] View exams schedule
- [x] Read notices
- [x] View profile
- [x] Change password

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/..." | Backend not running on port 4000 |
| "CORS error" | Frontend URL not in CORS config |
| "Invalid token" | Clear localStorage and re-login |
| "Database error" | Ensure MongoDB is running |
| "File upload fails" | Check `/media` folder exists |

---

## 📊 Response Format

All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {} // null if failed
}
```

---

## 🔐 Authentication Header

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

For file uploads:
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data
```

---

## 🗄️ Database Connection Test

```bash
# MongoDB CLI
mongosh
use College
db.students.count()  # See student count
```

---

## 📝 Common Tasks

### Add a New Student
1. Go to Admin → Student
2. Click Add button
3. Fill form with profile image
4. Click Submit
5. See in list immediately

### Mark Attendance
1. Go to Faculty → Attendance
2. Select branch and semester
3. Select date and mark status
4. Submit attendance
5. View in reports

### Upload Marks
1. Go to Faculty → Marks
2. Select branch, subject, semester, exam
3. Enter marks or upload CSV
4. Student can view immediately

### Upload Material
1. Go to Faculty → Material
2. Fill title, subject, semester
3. Upload file
4. Student can download

---

## 🔄 Data Flow

```
User Form Input
    ↓
AxiosWrapper (Auto Token + Headers)
    ↓
Backend Route
    ↓
Middleware (Auth Check)
    ↓
Controller (Logic)
    ↓
MongoDB (Data Stored)
    ↓
Response (Standardized JSON)
    ↓
Frontend (Redux State Update)
    ↓
UI Rerender (Live Data)
```

---

## 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

---

## 🎨 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Auth**: JWT
- **File Upload**: Multer
- **Email**: Nodemailer

---

## 📞 Key Contacts

- **API Docs**: See `INTEGRATION_GUIDE.md`
- **Testing Guide**: See `TESTING_GUIDE.md`
- **Full Report**: See `COMPLETION_REPORT.md`

---

## ✅ Production Deployment

1. Update `.env` with production URLs
2. Use production MongoDB URI
3. Set strong `JWT_SECRET`
4. Configure production email
5. Enable HTTPS
6. Run `npm run build` (frontend)
7. Set `NODE_ENV=production` (backend)
8. Deploy to server

---

## 🚀 Commands Summary

```bash
# Backend
npm install        # Install dependencies
npm run dev       # Start dev server
npm run seed      # Seed test data
npm start         # Production start

# Frontend
npm install       # Install dependencies
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview build

# Database
mongosh           # Connect to MongoDB
use College       # Switch to database
db.students.find()  # See all students
```

---

**Version**: 1.0  
**Last Updated**: March 13, 2026  
**Status**: Production Ready ✅
