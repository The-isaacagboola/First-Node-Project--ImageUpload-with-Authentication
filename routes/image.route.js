const express = require("express");
const {
  uploadImageController,
  fetchAllImages,
} = require("../controllers/image.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const uploadMiddleWare = require("../middlewares/upload.middleware");

const router = express.Router();

//upload an image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleWare.single("image"),
  uploadImageController
);

//fetch all available images
router.get("/images", authMiddleware, fetchAllImages);

//get all images
router.get("/sth");

module.exports = router;
