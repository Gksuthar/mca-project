# College Management System with Attendance

## Auto-Seeding Feature

This application automatically seeds the database with dummy data when you start it for the first time.

### How It Works

When you start the backend server, it automatically:
1. Checks if admin user exists
2. If not, creates sample data including:
   - 5 Branches (CSE, ECE, ME, CE, EE)
   - 6 Subjects
   - 1 Admin user
   - 3 Faculty members
   - 8 Students

### Default Login Credentials

#### Admin
- **Email:** admin@college.com
- **Password:** admin123

#### Faculty (All use same password)
- **Email:** rajesh@college.com | **Password:** faculty123
- **Email:** priya@college.com | **Password:** faculty123
- **Email:** vikram@college.com | **Password:** faculty123

#### Students (All use same password)
- **Email:** rahul@student.com | **Password:** student123 (CSE - Semester 3)
- **Email:** sneha@student.com | **Password:** student123 (CSE - Semester 3)
- **Email:** amit@student.com | **Password:** student123 (CSE - Semester 3)
- **Email:** ananya@student.com | **Password:** student123 (CSE - Semester 3)
- **Email:** karan@student.com | **Password:** student123 (CSE - Semester 4)
- **Email:** divya@student.com | **Password:** student123 (CSE - Semester 4)
- **Email:** arjun@student.com | **Password:** student123 (ECE - Semester 3)
- **Email:** kavya@student.com | **Password:** student123 (ECE - Semester 3)

## Running the Application

### Backend
```bash
cd backend
npm install
npm start
```

Server will start on http://localhost:4000

### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend will start on http://localhost:3000

## Manual Seeding (Optional)

If you want to manually reseed the database:

```bash
cd backend
npm run seed
```

This will:
- Clear all existing data
- Create fresh sample data
- Display credentials in the terminal

## Features

### For Admin
- Manage Students, Faculty, Branches, Subjects
- View attendance reports and statistics
- Export attendance data to CSV
- View system-wide analytics

### For Faculty
- Mark attendance with webcam face capture
- Bulk mark students present/absent
- View attendance records
- Upload and manage marks
- Post notices and materials

### For Students
- View own attendance with statistics
- Check attendance percentage
- View marks and exam schedules
- Access course materials
- View timetable and notices

## Attendance System Features

- **Face Recognition**: Capture student photos during attendance marking
- **Bulk Operations**: Mark entire class present/absent quickly
- **Statistics**: Real-time attendance percentage calculations
- **Reports**: Detailed attendance reports by branch/semester/date
- **CSV Export**: Download attendance data for analysis
