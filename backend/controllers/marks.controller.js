const Marks = require("../models/marks.model");
const Student = require("../models/details/student-details.model");
const ApiResponse = require("../utils/ApiResponse");

const getMarksController = async (req, res) => {
  try {
    const { studentId, semester, examId } = req.query;

    const query = { studentId: studentId };
    if (semester) {
      query.semester = semester;
    }

    if (examId) {
      query.examId = examId;
    }

    const marks = await Marks.find(query)
      .populate("branch", "name")
      .populate("marks.subject", "name")
      .populate("studentId", "firstName lastName enrollmentNo");

    if (!marks || marks.length === 0) {
      return ApiResponse.success([], "No marks found for the specified criteria").send(res);
    }

    return ApiResponse.success(marks, "Marks retrieved successfully").send(res);
  } catch (error) {
    console.error(error);
    return ApiResponse.internalServerError().send(res);
  }
};

const addMarksController = async (req, res) => {
  try {
    const { studentId, semester, branch, marks } = req.body;

    if (!studentId || !semester || !branch || !marks || !Array.isArray(marks)) {
      return ApiResponse.badRequest("Invalid input data").send(res);
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return ApiResponse.notFound("Student not found").send(res);
    }

    let existingMarks = await Marks.findOne({ studentId: studentId, semester });

    if (existingMarks) {
      existingMarks.marks = marks;
      await existingMarks.save();
    } else {
      existingMarks = await Marks.create({
        studentId: studentId,
        semester,
        branch,
        marks,
      });
    }

    return ApiResponse.success(existingMarks, "Marks updated successfully").send(res);
  } catch (error) {
    console.error(error);
    return ApiResponse.internalServerError().send(res);
  }
};

const deleteMarksController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMarks = await Marks.findByIdAndDelete(id);

    if (!deletedMarks) {
      return ApiResponse.notFound("Marks not found").send(res);
    }

    return ApiResponse.success(null, "Marks deleted successfully").send(res);
  } catch (error) {
    console.error(error);
    return ApiResponse.internalServerError().send(res);
  }
};

const addBulkMarksController = async (req, res) => {
  try {
    const { marks, examId, subjectId, semester } = req.body;

    if (!marks || !Array.isArray(marks) || !examId || !subjectId || !semester) {
      return ApiResponse.badRequest(
        "Invalid input data. Required: marks array, examId, subjectId, and semester"
      ).send(res);
    }

    const results = [];
    for (const markData of marks) {
      const existingMark = await Marks.findOne({
        studentId: markData.studentId,
        examId,
        subjectId,
        semester,
      });

      if (existingMark) {
        existingMark.marksObtained = markData.obtainedMarks;
        await existingMark.save();
        results.push(existingMark);
      } else {
        const newMark = await Marks.create({
          studentId: markData.studentId,
          examId,
          subjectId,
          semester,
          marksObtained: markData.obtainedMarks,
        });
        results.push(newMark);
      }
    }

    return ApiResponse.success(results, "Marks submitted successfully").send(res);
  } catch (error) {
    console.error("Error in addBulkMarksController:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const getStudentsWithMarksController = async (req, res) => {
  try {
    const { branch, subject, semester, examId } = req.query;

    if (!branch || !subject || !semester || !examId) {
      return ApiResponse.badRequest(
        "Missing required parameters: branch, subject, semester, and examId are required"
      ).send(res);
    }

    const students = await Student.find({
      branchId: branch,
      semester: Number(semester),
    }).select("_id enrollmentNo firstName lastName");

    if (!students || students.length === 0) {
      return ApiResponse.success([], "No students found for the specified criteria").send(res);
    }

    const marks = await Marks.find({
      studentId: { $in: students.map((s) => s._id) },
      examId,
      subjectId: subject,
      semester: Number(semester),
    });

    const studentsWithMarks = students.map((student) => {
      const studentMarks = marks.find(
        (m) => m.studentId.toString() === student._id.toString()
      );
      return {
        ...student.toObject(),
        obtainedMarks: studentMarks ? studentMarks.marksObtained : 0,
      };
    });

    return ApiResponse.success(studentsWithMarks, "Students retrieved successfully with marks").send(res);
  } catch (error) {
    console.error("Error in getStudentsWithMarksController:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const getStudentMarksController = async (req, res) => {
  try {
    const { semester } = req.query;
    const studentId = req.userId;

    if (!semester) {
      return ApiResponse.badRequest("Semester is required").send(res);
    }

    let studentIdToUse = studentId;
    const studentDetail = await Student.findOne({ userId: studentId });
    if (studentDetail) {
      studentIdToUse = studentDetail._id;
    } else {
      // Fallback for older records
      const fallback = await Student.findOne({ email: req.user?.email });
      if (fallback) studentIdToUse = fallback._id;
    }

    const marks = await Marks.find({
      studentId: studentIdToUse,
      semester: Number(semester),
    })
      .populate("subjectId", "name")
      .populate("examId", "name examType totalMarks");

    if (!marks || marks.length === 0) {
      return ApiResponse.success([], "No marks found for this semester").send(res);
    }

    return ApiResponse.success(marks, "Marks retrieved successfully").send(res);
  } catch (error) {
    console.error("Error in getStudentMarksController:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

module.exports = {
  getMarksController,
  addMarksController,
  deleteMarksController,
  addBulkMarksController,
  getStudentsWithMarksController,
  getStudentMarksController,
};
