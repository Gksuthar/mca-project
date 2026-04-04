const express = require("express");
const {
  markAttendance,
  markBulkAttendance,
  getAttendance,
  getStudentAttendance,
  getAttendanceStats,
  deleteAttendance
} = require("../controllers/attendance.controller");
const { auth } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const router = express.Router();

router.post("/", auth, upload.single("faceImage"), markAttendance);
router.post("/bulk", auth, markBulkAttendance);
router.get("/", auth, getAttendance);
router.get("/student", auth, getStudentAttendance);
router.get("/stats", auth, getAttendanceStats);
router.delete("/:id", auth, deleteAttendance);

module.exports = router;
