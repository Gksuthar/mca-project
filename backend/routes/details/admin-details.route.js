const express = require("express");
const router = express.Router();
const {
  getAllDetailsController,
  registerAdminController,
  updateDetailsController,
  deleteDetailsController,
  loginAdminController,
  getMyDetailsController,
  sendForgetPasswordEmail,
  updatePasswordHandler,
  updateLoggedInPasswordController,
} = require("../../controllers/details/admin-details.controller");
const upload = require("../../middlewares/multer.middleware");
const { protect } = require("../../middlewares/auth.middleware");

router.post("/register", upload.single("file"), registerAdminController);
router.post("/login", loginAdminController);
router.get("/my-details", protect, getMyDetailsController);

router.get("/", protect, getAllDetailsController);
router.patch("/:id", protect, upload.single("file"), updateDetailsController);
router.delete("/:id", protect, deleteDetailsController);
router.post("/forget-password", sendForgetPasswordEmail);
router.post("/update-password/:resetId", updatePasswordHandler);
router.post("/change-password", protect, updateLoggedInPasswordController);

module.exports = router;
