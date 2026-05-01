// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const User = require("./models/user.model");
// const Admin = require("./models/details/admin-details.model");
// const Faculty = require("./models/details/faculty-details.model");
// const Student = require("./models/details/student-details.model");
// const Branch = require("./models/branch.model");
// const Subject = require("./models/subject.model");

// const autoSeed = async () => {
//   try {
//     const existingAdmin = await Admin.findOne();
//     if (existingAdmin) {
//       return;
//     }

//     console.log("\n🌱 No data found. Auto-seeding database...\n");

//     let cseBranch = await Branch.findOne({ branchId: "CSE" });
//     let eceBranch = await Branch.findOne({ branchId: "ECE" });

//     if (!cseBranch || !eceBranch) {
//       await Branch.deleteMany({});
//       const branches = await Branch.insertMany([
//         { branchId: "CSE", name: "Computer Science Engineering" },
//         { branchId: "ECE", name: "Electronics and Communication Engineering" },
//         { branchId: "ME", name: "Mechanical Engineering" },
//         { branchId: "CE", name: "Civil Engineering" },
//         { branchId: "EE", name: "Electrical Engineering" }
//       ]);
//       cseBranch = branches[0];
//       eceBranch = branches[1];
//     }

//     await Subject.insertMany([
//       { name: "Data Structures", code: "CS101", semester: 3, branch: cseBranch._id, credits: 4 },
//       { name: "Database Management", code: "CS102", semester: 3, branch: cseBranch._id, credits: 4 },
//       { name: "Operating Systems", code: "CS201", semester: 4, branch: cseBranch._id, credits: 4 },
//       { name: "Computer Networks", code: "CS202", semester: 4, branch: cseBranch._id, credits: 3 },
//       { name: "Digital Electronics", code: "EC101", semester: 3, branch: eceBranch._id, credits: 4 },
//       { name: "Signal Processing", code: "EC102", semester: 3, branch: eceBranch._id, credits: 3 }
//     ]);

//     // Create User records for authentication
//     await User.create({
//       name: "Admin User",
//       email: "admin@college.com",
//       password: "admin123",
//       role: "admin",
//     });

//     await Admin.create({
//       employeeId: 100001,
//       firstName: "Admin",
//       middleName: "",
//       lastName: "User",
//       email: "admin@college.com",
//       phone: "9999999999",
//       address: "College Admin Building",
//       city: "Mumbai",
//       state: "Maharashtra",
//       pincode: "400001",
//       country: "India",
//       gender: "male",
//       dob: new Date("1985-01-01"),
//       designation: "System Administrator",
//       joiningDate: new Date("2020-01-01"),
//       salary: 80000,
//       status: "active",
//       isSuperAdmin: true,
//       bloodGroup: "O+",
//       emergencyContact: {
//         name: "Emergency Admin",
//         relationship: "Spouse",
//         phone: "8888888888"
//       },
//       password: "admin123"
//     });

//     const hashedPassword = await bcrypt.hash("faculty123", 10);

//     await Faculty.insertMany([
//       {
//         employeeId: 200001,
//         firstName: "Rajesh",
//         lastName: "Kumar",
//         email: "rajesh@college.com",
//         phone: "9876543210",
//         address: "Faculty Housing Block A",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         gender: "male",
//         dob: new Date("1980-05-15"),
//         designation: "Professor",
//         joiningDate: new Date("2015-08-01"),
//         salary: 75000,
//         status: "active",
//         branchId: cseBranch._id,
//         bloodGroup: "A+",
//         emergencyContact: {
//           name: "Priya Kumar",
//           relationship: "Spouse",
//           phone: "9876543211"
//         },
//         password: hashedPassword
//       },
//       {
//         employeeId: 200002,
//         firstName: "Priya",
//         lastName: "Sharma",
//         email: "priya@college.com",
//         phone: "9876543220",
//         address: "Faculty Housing Block B",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         gender: "female",
//         dob: new Date("1985-03-20"),
//         designation: "Associate Professor",
//         joiningDate: new Date("2018-01-15"),
//         salary: 65000,
//         status: "active",
//         branchId: cseBranch._id,
//         bloodGroup: "B+",
//         emergencyContact: {
//           name: "Amit Sharma",
//           relationship: "Spouse",
//           phone: "9876543221"
//         },
//         password: hashedPassword
//       },
//       {
//         employeeId: 200003,
//         firstName: "Vikram",
//         lastName: "Singh",
//         email: "vikram@college.com",
//         phone: "9876543230",
//         address: "Faculty Housing Block C",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         gender: "male",
//         dob: new Date("1982-07-10"),
//         designation: "Assistant Professor",
//         joiningDate: new Date("2019-06-01"),
//         salary: 60000,
//         status: "active",
//         branchId: eceBranch._id,
//         bloodGroup: "O-",
//         emergencyContact: {
//           name: "Anjali Singh",
//           relationship: "Spouse",
//           phone: "9876543231"
//         },
//         password: hashedPassword
//       }
//     ]);

//     // Create faculty user accounts
//     await User.insertMany([
//       {
//         name: "Rajesh Kumar",
//         email: "rajesh@college.com",
//         password: "faculty123",
//         role: "faculty",
//       },
//       {
//         name: "Priya Sharma",
//         email: "priya@college.com",
//         password: "faculty123",
//         role: "faculty",
//       },
//       {
//         name: "Vikram Singh",
//         email: "vikram@college.com",
//         password: "faculty123",
//         role: "faculty",
//       }
//     ]);

//     const hashedStudentPassword = await bcrypt.hash("student123", 10);

//     await Student.insertMany([
//       {
//         enrollmentNo: 2021001,
//         firstName: "Rahul",
//         middleName: "Kumar",
//         lastName: "Verma",
//         email: "rahul@student.com",
//         phone: "9988776655",
//         semester: 3,
//         branchId: cseBranch._id,
//         gender: "male",
//         dob: new Date("2003-04-15"),
//         address: "Student Hostel A-101",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         status: "active",
//         bloodGroup: "B+",
//         emergencyContact: {
//           name: "Suresh Verma",
//           relationship: "Father",
//           phone: "9988776656"
//         },
//         password: hashedStudentPassword
//       },
//       {
//         enrollmentNo: 2021002,
//         firstName: "Sneha",
//         middleName: "R",
//         lastName: "Patel",
//         email: "sneha@student.com",
//         phone: "9988776665",
//         semester: 3,
//         branchId: cseBranch._id,
//         gender: "female",
//         dob: new Date("2003-06-20"),
//         address: "Student Hostel B-202",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         status: "active",
//         bloodGroup: "A+",
//         emergencyContact: {
//           name: "Ramesh Patel",
//           relationship: "Father",
//           phone: "9988776666"
//         },
//         password: hashedStudentPassword
//       },
//       {
//         enrollmentNo: 2021003,
//         firstName: "Amit",
//         middleName: "Singh",
//         lastName: "Chauhan",
//         email: "amit@student.com",
//         phone: "9988776675",
//         semester: 3,
//         branchId: cseBranch._id,
//         gender: "male",
//         dob: new Date("2003-08-10"),
//         address: "Student Hostel A-105",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         status: "active",
//         bloodGroup: "O+",
//         emergencyContact: {
//           name: "Vijay Chauhan",
//           relationship: "Father",
//           phone: "9988776676"
//         },
//         password: hashedStudentPassword
//       },
//       {
//         enrollmentNo: 2021004,
//         firstName: "Ananya",
//         middleName: "K",
//         lastName: "Reddy",
//         email: "ananya@student.com",
//         phone: "9988776685",
//         semester: 3,
//         branchId: cseBranch._id,
//         gender: "female",
//         dob: new Date("2003-02-25"),
//         address: "Student Hostel B-210",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         status: "active",
//         bloodGroup: "AB+",
//         emergencyContact: {
//           name: "Krishna Reddy",
//           relationship: "Father",
//           phone: "9988776686"
//         },
//         password: hashedStudentPassword
//       },
//       {
//         enrollmentNo: 2021005,
//         firstName: "Karan",
//         middleName: "M",
//         lastName: "Mehta",
//         email: "karan@student.com",
//         phone: "9988776695",
//         semester: 4,
//         branchId: cseBranch._id,
//         gender: "male",
//         dob: new Date("2002-11-30"),
//         address: "Student Hostel A-120",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         status: "active",
//         bloodGroup: "B-",
//         emergencyContact: {
//           name: "Rajesh Mehta",
//           relationship: "Father",
//           phone: "9988776696"
//         },
//         password: hashedStudentPassword
//       },
//       {
//         enrollmentNo: 2021006,
//         firstName: "Divya",
//         middleName: "V",
//         lastName: "Iyer",
//         email: "divya@student.com",
//         phone: "9988776705",
//         semester: 4,
//         branchId: cseBranch._id,
//         gender: "female",
//         dob: new Date("2002-09-18"),
//         address: "Student Hostel B-215",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         status: "active",
//         bloodGroup: "A-",
//         emergencyContact: {
//           name: "Venkat Iyer",
//           relationship: "Father",
//           phone: "9988776706"
//         },
//         password: hashedStudentPassword
//       },
//       {
//         enrollmentNo: 2021007,
//         firstName: "Arjun",
//         middleName: "Kumar",
//         lastName: "Nair",
//         email: "arjun@student.com",
//         phone: "9988776715",
//         semester: 3,
//         branchId: eceBranch._id,
//         gender: "male",
//         dob: new Date("2003-01-12"),
//         address: "Student Hostel C-301",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         status: "active",
//         bloodGroup: "O+",
//         emergencyContact: {
//           name: "Sunil Nair",
//           relationship: "Father",
//           phone: "9988776716"
//         },
//         password: hashedStudentPassword
//       },
//       {
//         enrollmentNo: 2021008,
//         firstName: "Kavya",
//         middleName: "P",
//         lastName: "Joshi",
//         email: "kavya@student.com",
//         phone: "9988776725",
//         semester: 3,
//         branchId: eceBranch._id,
//         gender: "female",
//         dob: new Date("2003-05-22"),
//         address: "Student Hostel D-405",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         country: "India",
//         status: "active",
//         bloodGroup: "B+",
//         emergencyContact: {
//           name: "Prakash Joshi",
//           relationship: "Father",
//           phone: "9988776726"
//         },
//         password: hashedStudentPassword
//       }
//     ]);

//     // Create student user accounts
//     await User.insertMany([
//       { name: "Rahul Kumar Verma", email: "rahul@student.com", password: "student123", role: "student" },
//       { name: "Sneha R Patel", email: "sneha@student.com", password: "student123", role: "student" },
//       { name: "Amit Singh Chauhan", email: "amit@student.com", password: "student123", role: "student" },
//       { name: "Ananya K Reddy", email: "ananya@student.com", password: "student123", role: "student" },
//       { name: "Karan M Mehta", email: "karan@student.com", password: "student123", role: "student" },
//       { name: "Divya V Iyer", email: "divya@student.com", password: "student123", role: "student" },
//       { name: "Arjun Kumar Nair", email: "arjun@student.com", password: "student123", role: "student" },
//       { name: "Kavya P Joshi", email: "kavya@student.com", password: "student123", role: "student" }
//     ]);

//     console.log("✅ Database seeded successfully!");
//     console.log("\n📋 DEFAULT CREDENTIALS:");
//     console.log("   Admin: admin@college.com / admin123");
//     console.log("   Faculty: rajesh@college.com / faculty123");
//     console.log("   Student: rahul@student.com / student123\n");

//   } catch (error) {
//     console.error("❌ Auto-seed error:", error.message);
//   }
// };

// module.exports = autoSeed;
