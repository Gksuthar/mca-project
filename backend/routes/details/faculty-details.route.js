const express = require("express");
const router = express.Router();
const {
  loginFacultyController,
  registerFacultyController,
  updateFacultyController,
  deleteFacultyController,
  getAllFacultyController,
  filterFacultyController,
  getMyFacultyDetailsController,
  sendFacultyResetPasswordEmail,
  updateFacultyPasswordHandler,
  updateLoggedInPasswordController,
} = require("../../controllers/details/faculty-details.controller");
const upload = require("../../middlewares/multer.middleware");
const { protect } = require("../../middlewares/auth.middleware");

router.post("/register", upload.single("file"), registerFacultyController);
router.post("/login", loginFacultyController);
router.get("/my-details", protect, getMyFacultyDetailsController);

router.get("/", protect, getAllFacultyController);
router.post("/filter", protect, filterFacultyController);
router.patch("/:id", protect, upload.single("file"), updateFacultyController);
router.delete("/:id", protect, deleteFacultyController);
router.post("/forget-password", sendFacultyResetPasswordEmail);
router.post("/update-password/:resetId", updateFacultyPasswordHandler);
router.post("/change-password", protect, updateLoggedInPasswordController);

module.exports = router;
