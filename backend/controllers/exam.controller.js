const Exam = require("../models/exam.model");
const ApiResponse = require("../utils/ApiResponse");

const getAllExamsController = async (req, res) => {
  try {
    const { search = "", examType = "", semester = "", branchId = "", subjectId = "" } = req.query;

    let query = {};

    if (semester) query.semester = semester;
    if (examType) query.examType = examType;
    if (branchId) query.branchId = branchId;
    if (subjectId) query.subjectId = subjectId;

    const exams = await Exam.find(query)
      .populate("subjectId", "name")
      .populate("branchId", "name");

    return ApiResponse.success(exams, "Exams loaded!").send(res);
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

const addExamController = async (req, res) => {
  try {
    const formData = req.body;
    if (req.file) {
      formData.timetableLink = req.file.filename;
    }
    const exam = await Exam.create(formData);
    return ApiResponse.success(exam, "Exam Added Successfully!").send(res);
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

const updateExamController = async (req, res) => {
  try {
    const formData = req.body;
    if (req.file) {
      formData.timetableLink = req.file.filename;
    }
    const exam = await Exam.findByIdAndUpdate(req.params.id, formData, {
      new: true,
    });
    return ApiResponse.success(exam, "Exam Updated Successfully!").send(res);
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

const deleteExamController = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    return ApiResponse.success(exam, "Exam Deleted Successfully!").send(res);
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

module.exports = {
  getAllExamsController,
  addExamController,
  updateExamController,
  deleteExamController,
};
