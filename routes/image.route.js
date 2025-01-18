const express = require("express");
const {
  uploadImageController,
  fetchAllImages,
  deleteImage,
} = require("../controllers/image.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const uploadMiddleWare = require("../middlewares/upload.middleware");
const sameUserAuth = require("../middlewares/sameAuth.middleware");

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

// TODO
//delete an image
router.delete("/delete/:id", authMiddleware, sameUserAuth, deleteImage);

//change Password

//fetching and pagination logic

module.exports = router;
