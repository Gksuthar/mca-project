const mongoose = require("mongoose");
require("dotenv").config();

const Admin = require("./models/details/admin-details.model");
const Faculty = require("./models/details/faculty-details.model");
const Student = require("./models/details/student-details.model");
const Branch = require("./models/branch.model");
const Subject = require("./models/subject.model");
const Attendance = require("./models/attendance.model");

const clearDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;
    await mongoose.connect(MONGODB_URI);
    
    console.log("🗑️  Clearing database...");
    
    await Admin.deleteMany({});
    await Faculty.deleteMany({});
    await Student.deleteMany({});
    await Branch.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    
    console.log("✅ Database cleared successfully!");
    console.log("🔄 Please restart the server to re-seed with hashed passwords");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();
