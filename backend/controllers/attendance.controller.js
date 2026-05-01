const Attendance = require("../models/attendance.model");
const Student = require("../models/details/student-details.model");
const Faculty = require("../models/details/faculty-details.model");
const ApiResponse = require("../utils/ApiResponse");

const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, faceImage, branchId, semester } = req.body;
    const markedBy = req.userId;

    if (!studentId || !date || !status || !branchId || !semester) {
      return ApiResponse.badRequest("Missing required fields").send(res);
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return ApiResponse.notFound("Student not found").send(res);
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      studentId,
      date: attendanceDate
    });

    const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    if (attendance) {
      attendance.status = status;
      attendance.faceImage = faceImage || attendance.faceImage;
      attendance.markedBy = markedBy;
      attendance.time = currentTime;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        studentId,
        date: attendanceDate,
        status,
        faceImage,
        branchId,
        semester,
        markedBy,
        time: currentTime
      });
    }

    return ApiResponse.success(attendance, "Attendance marked successfully").send(res);
  } catch (error) {
    console.error("Error in markAttendance:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const markBulkAttendance = async (req, res) => {
  try {
    const { attendanceData, date, branchId, semester } = req.body;
    const markedBy = req.userId;

    if (!attendanceData || !Array.isArray(attendanceData) || !date || !branchId || !semester) {
      return ApiResponse.badRequest("Missing required fields").send(res);
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const results = [];
    for (const item of attendanceData) {
      let attendance = await Attendance.findOne({
        studentId: item.studentId,
        date: attendanceDate
      });

      if (attendance) {
        attendance.status = item.status;
        attendance.faceImage = item.faceImage || attendance.faceImage;
        attendance.markedBy = markedBy;
        attendance.time = currentTime;
        await attendance.save();
      } else {
        attendance = await Attendance.create({
          studentId: item.studentId,
          date: attendanceDate,
          status: item.status,
          faceImage: item.faceImage,
          branchId,
          semester,
          markedBy,
          time: currentTime
        });
      }
      results.push(attendance);
    }

    return ApiResponse.success(results, "Bulk attendance marked successfully").send(res);
  } catch (error) {
    console.error("Error in markBulkAttendance:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const getAttendance = async (req, res) => {
  try {
    const { studentId, branchId, semester, startDate, endDate } = req.query;
    
    const query = {};
    if (studentId) query.studentId = studentId;
    if (branchId) query.branchId = branchId;
    if (semester) query.semester = Number(semester);
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate("studentId", "enrollmentNo firstName middleName lastName semester")
      .populate("branchId", "name")
      .populate("markedBy", "firstName lastName")
      .sort({ date: -1 });

    return ApiResponse.success(attendance, "Attendance retrieved successfully").send(res);
  } catch (error) {
    console.error("Error in getAttendance:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.userId;
    const { startDate, endDate, semester } = req.query;

    const query = { studentId };
    if (semester) query.semester = Number(semester);
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate("branchId", "name")
      .populate("markedBy", "firstName lastName")
      .sort({ date: -1 });

    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === "present").length;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    return ApiResponse.success({
      attendance,
      stats: {
        totalDays,
        presentDays,
        absentDays: totalDays - presentDays,
        percentage
      }
    }, "Attendance retrieved successfully").send(res);
  } catch (error) {
    console.error("Error in getStudentAttendance:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const getAttendanceStats = async (req, res) => {
  try {
    const { branchId, semester, startDate, endDate } = req.query;

    const query = {};
    if (branchId) query.branchId = branchId;
    if (semester) query.semester = Number(semester);
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query).populate("studentId", "enrollmentNo firstName middleName lastName");

    const studentStats = {};
    attendance.forEach(record => {
      if (!record.studentId) return;
      const sid = record.studentId._id.toString();
      if (!studentStats[sid]) {
        studentStats[sid] = {
          student: record.studentId,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0
        };
      }
      studentStats[sid].totalDays++;
      if (record.status === "present") {
        studentStats[sid].presentDays++;
      } else {
        studentStats[sid].absentDays++;
      }
    });

    const stats = Object.values(studentStats).map(stat => ({
      ...stat,
      percentage: stat.totalDays > 0 ? ((stat.presentDays / stat.totalDays) * 100).toFixed(2) : 0
    }));

    return ApiResponse.success(stats, "Attendance stats retrieved successfully").send(res);
  } catch (error) {
    console.error("Error in getAttendanceStats:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      return ApiResponse.notFound("Attendance record not found").send(res);
    }

    return ApiResponse.success(null, "Attendance deleted successfully").send(res);
  } catch (error) {
    console.error("Error in deleteAttendance:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

module.exports = {
  markAttendance,
  markBulkAttendance,
  getAttendance,
  getStudentAttendance,
  getAttendanceStats,
  deleteAttendance
};
