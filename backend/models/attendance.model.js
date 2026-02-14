const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentDetail",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true
  },
  faceImage: {
    type: String
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FacultyDetail"
  },
  time: {
    type: String
  }
}, { timestamps: true });

attendanceSchema.index({ studentId: 1, date: 1 });
attendanceSchema.index({ branchId: 1, date: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
