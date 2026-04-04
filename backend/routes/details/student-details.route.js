const express = require("express");
const router = express.Router();
const {
  loginStudentController,
  getAllDetailsController,
  registerStudentController,
  updateDetailsController,
  deleteDetailsController,
  getMyDetailsController,
  sendForgetPasswordEmail,
  updatePasswordHandler,
  searchStudentsController,
  updateLoggedInPasswordController,
} = require("../../controllers/details/student-details.controller");
const upload = require("../../middlewares/multer.middleware");
const { protect } = require("../../middlewares/auth.middleware");

router.post("/register", upload.single("file"), registerStudentController);
router.post("/login", loginStudentController);
router.get("/my-details", protect, getMyDetailsController);

router.get("/", protect, getAllDetailsController);
router.patch("/:id", protect, upload.single("file"), updateDetailsController);
router.delete("/:id", protect, deleteDetailsController);
router.post("/forget-password", sendForgetPasswordEmail);
router.post("/update-password/:resetId", updatePasswordHandler);
router.post("/change-password", protect, updateLoggedInPasswordController);
router.post("/search", protect, searchStudentsController);

module.exports = router;
