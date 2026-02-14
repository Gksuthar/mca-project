const mongoose = require("mongoose");
const connectToMongo = require("./database/db");
const Admin = require("./models/details/admin-details.model");
const Faculty = require("./models/details/faculty-details.model");
const Student = require("./models/details/student-details.model");
const Branch = require("./models/branch.model");
const Subject = require("./models/subject.model");

const seedDatabase = async () => {
  try {
    await connectToMongo();
    
    console.log("🌱 Starting database seeding...\n");

    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log("✅ Database already seeded. Skipping...");
      await mongoose.connection.close();
      return;
    }

    await Branch.deleteMany({});
    await Admin.deleteMany({});
    await Faculty.deleteMany({});
    await Student.deleteMany({});
    await Subject.deleteMany({});

    const branches = await Branch.insertMany([
      { branchId: "CSE", name: "Computer Science Engineering" },
      { branchId: "ECE", name: "Electronics and Communication Engineering" },
      { branchId: "ME", name: "Mechanical Engineering" },
      { branchId: "CE", name: "Civil Engineering" },
      { branchId: "EE", name: "Electrical Engineering" }
    ]);
    console.log(`✅ Created ${branches.length} branches`);

    const cseBranch = branches[0];
    const eceBranch = branches[1];

    const subjects = await Subject.insertMany([
      { name: "Data Structures", code: "CS101", semester: 3, branch: cseBranch._id, credits: 4 },
      { name: "Database Management", code: "CS102", semester: 3, branch: cseBranch._id, credits: 4 },
      { name: "Operating Systems", code: "CS201", semester: 4, branch: cseBranch._id, credits: 4 },
      { name: "Computer Networks", code: "CS202", semester: 4, branch: cseBranch._id, credits: 3 },
      { name: "Digital Electronics", code: "EC101", semester: 3, branch: eceBranch._id, credits: 4 },
      { name: "Signal Processing", code: "EC102", semester: 3, branch: eceBranch._id, credits: 3 }
    ]);
    console.log(`✅ Created ${subjects.length} subjects`);

    const admin = await Admin.create({
      employeeId: 100001,
      firstName: "Admin",
      middleName: "",
      lastName: "User",
      email: "admin@college.com",
      phone: "9999999999",
      address: "College Admin Building",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
      gender: "male",
      dob: new Date("1985-01-01"),
      designation: "System Administrator",
      joiningDate: new Date("2020-01-01"),
      salary: 80000,
      status: "active",
      isSuperAdmin: true,
      bloodGroup: "O+",
      emergencyContact: {
        name: "Emergency Admin",
        relationship: "Spouse",
        phone: "8888888888"
      },
      password: "admin123"
    });
    console.log("✅ Created admin user");

    const faculties = await Faculty.insertMany([
      {
        employeeId: 200001,
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "rajesh@college.com",
        phone: "9876543210",
        address: "Faculty Housing Block A",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        gender: "male",
        dob: new Date("1980-05-15"),
        designation: "Professor",
        joiningDate: new Date("2015-08-01"),
        salary: 75000,
        status: "active",
        branchId: cseBranch._id,
        bloodGroup: "A+",
        emergencyContact: {
          name: "Priya Kumar",
          relationship: "Spouse",
          phone: "9876543211"
        },
        password: "faculty123"
      },
      {
        employeeId: 200002,
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya@college.com",
        phone: "9876543220",
        address: "Faculty Housing Block B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        gender: "female",
        dob: new Date("1985-03-20"),
        designation: "Associate Professor",
        joiningDate: new Date("2018-01-15"),
        salary: 65000,
        status: "active",
        branchId: cseBranch._id,
        bloodGroup: "B+",
        emergencyContact: {
          name: "Amit Sharma",
          relationship: "Spouse",
          phone: "9876543221"
        },
        password: "faculty123"
      },
      {
        employeeId: 200003,
        firstName: "Vikram",
        lastName: "Singh",
        email: "vikram@college.com",
        phone: "9876543230",
        address: "Faculty Housing Block C",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        gender: "male",
        dob: new Date("1982-07-10"),
        designation: "Assistant Professor",
        joiningDate: new Date("2019-06-01"),
        salary: 60000,
        status: "active",
        branchId: eceBranch._id,
        bloodGroup: "O-",
        emergencyContact: {
          name: "Anjali Singh",
          relationship: "Spouse",
          phone: "9876543231"
        },
        password: "faculty123"
      }
    ]);
    console.log(`✅ Created ${faculties.length} faculty members`);

    const students = await Student.insertMany([
      {
        enrollmentNo: 2021001,
        firstName: "Rahul",
        middleName: "Kumar",
        lastName: "Verma",
        email: "rahul@student.com",
        phone: "9988776655",
        semester: 3,
        branchId: cseBranch._id,
        gender: "male",
        dob: new Date("2003-04-15"),
        address: "Student Hostel A-101",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        status: "active",
        bloodGroup: "B+",
        emergencyContact: {
          name: "Suresh Verma",
          relationship: "Father",
          phone: "9988776656"
        },
        password: "student123"
      },
      {
        enrollmentNo: 2021002,
        firstName: "Sneha",
        middleName: "R",
        lastName: "Patel",
        email: "sneha@student.com",
        phone: "9988776665",
        semester: 3,
        branchId: cseBranch._id,
        gender: "female",
        dob: new Date("2003-06-20"),
        address: "Student Hostel B-202",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        status: "active",
        bloodGroup: "A+",
        emergencyContact: {
          name: "Ramesh Patel",
          relationship: "Father",
          phone: "9988776666"
        },
        password: "student123"
      },
      {
        enrollmentNo: 2021003,
        firstName: "Amit",
        middleName: "Singh",
        lastName: "Chauhan",
        email: "amit@student.com",
        phone: "9988776675",
        semester: 3,
        branchId: cseBranch._id,
        gender: "male",
        dob: new Date("2003-08-10"),
        address: "Student Hostel A-105",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        status: "active",
        bloodGroup: "O+",
        emergencyContact: {
          name: "Vijay Chauhan",
          relationship: "Father",
          phone: "9988776676"
        },
        password: "student123"
      },
      {
        enrollmentNo: 2021004,
        firstName: "Ananya",
        middleName: "K",
        lastName: "Reddy",
        email: "ananya@student.com",
        phone: "9988776685",
        semester: 3,
        branchId: cseBranch._id,
        gender: "female",
        dob: new Date("2003-02-25"),
        address: "Student Hostel B-210",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        status: "active",
        bloodGroup: "AB+",
        emergencyContact: {
          name: "Krishna Reddy",
          relationship: "Father",
          phone: "9988776686"
        },
        password: "student123"
      },
      {
        enrollmentNo: 2021005,
        firstName: "Karan",
        middleName: "M",
        lastName: "Mehta",
        email: "karan@student.com",
        phone: "9988776695",
        semester: 4,
        branchId: cseBranch._id,
        gender: "male",
        dob: new Date("2002-11-30"),
        address: "Student Hostel A-120",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        status: "active",
        bloodGroup: "B-",
        emergencyContact: {
          name: "Rajesh Mehta",
          relationship: "Father",
          phone: "9988776696"
        },
        password: "student123"
      },
      {
        enrollmentNo: 2021006,
        firstName: "Divya",
        middleName: "V",
        lastName: "Iyer",
        email: "divya@student.com",
        phone: "9988776705",
        semester: 4,
        branchId: cseBranch._id,
        gender: "female",
        dob: new Date("2002-09-18"),
        address: "Student Hostel B-215",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        status: "active",
        bloodGroup: "A-",
        emergencyContact: {
          name: "Venkat Iyer",
          relationship: "Father",
          phone: "9988776706"
        },
        password: "student123"
      },
      {
        enrollmentNo: 2021007,
        firstName: "Arjun",
        middleName: "Kumar",
        lastName: "Nair",
        email: "arjun@student.com",
        phone: "9988776715",
        semester: 3,
        branchId: eceBranch._id,
        gender: "male",
        dob: new Date("2003-01-12"),
        address: "Student Hostel C-301",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        status: "active",
        bloodGroup: "O+",
        emergencyContact: {
          name: "Sunil Nair",
          relationship: "Father",
          phone: "9988776716"
        },
        password: "student123"
      },
      {
        enrollmentNo: 2021008,
        firstName: "Kavya",
        middleName: "P",
        lastName: "Joshi",
        email: "kavya@student.com",
        phone: "9988776725",
        semester: 3,
        branchId: eceBranch._id,
        gender: "female",
        dob: new Date("2003-05-22"),
        address: "Student Hostel D-405",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        status: "active",
        bloodGroup: "B+",
        emergencyContact: {
          name: "Prakash Joshi",
          relationship: "Father",
          phone: "9988776726"
        },
        password: "student123"
      }
    ]);
    console.log(`✅ Created ${students.length} students`);

    console.log("\n📋 SEEDING COMPLETED SUCCESSFULLY!\n");
    console.log("═══════════════════════════════════════════");
    console.log("🔐 LOGIN CREDENTIALS");
    console.log("═══════════════════════════════════════════\n");
    
    console.log("👨‍💼 ADMIN:");
    console.log("   Email: admin@college.com");
    console.log("   Password: admin123\n");
    
    console.log("👩‍🏫 FACULTY (All have same password):");
    console.log("   Email: rajesh@college.com");
    console.log("   Email: priya@college.com");
    console.log("   Email: vikram@college.com");
    console.log("   Password: faculty123\n");
    
    console.log("🎓 STUDENTS (All have same password):");
    console.log("   Email: rahul@student.com (CSE - Sem 3)");
    console.log("   Email: sneha@student.com (CSE - Sem 3)");
    console.log("   Email: amit@student.com (CSE - Sem 3)");
    console.log("   Email: ananya@student.com (CSE - Sem 3)");
    console.log("   Email: karan@student.com (CSE - Sem 4)");
    console.log("   Email: divya@student.com (CSE - Sem 4)");
    console.log("   Email: arjun@student.com (ECE - Sem 3)");
    console.log("   Email: kavya@student.com (ECE - Sem 3)");
    console.log("   Password: student123\n");
    
    console.log("═══════════════════════════════════════════\n");

  } catch (error) {
    console.error("❌ Error while seeding:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedDatabase();
