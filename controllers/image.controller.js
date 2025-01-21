const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../helpers/cloudinary.helper");
const Image = require("../models/image.model");
const fs = require("fs");

const uploadImageController = async (req, res) => {
  try {
    //check if file is present
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please attach an image",
      });
    }

    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //delete the file from local storage
    fs.unlinkSync(req.file.path, (err) => {
      if (err) console.log("Error deleting file, please retry");
    });

    //store the image url and pubId to the database
    const newImg = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await newImg.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded and saved successfully",
      image: newImg,
    });
  } catch (error) {
    console.error("Error Uploading image to cloudinary:::", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const fetchAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; //5 data responses at a time
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    // { "createdAt" : "asc" } ---- Response
    sortObj;
    const allImages = await Image.find({})
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    if (!allImages)
      return res.status(404).json({
        message: "No images found. Please upload a new image",
      });

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalImages,
      data: allImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong. Please try again",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const publicId = req.assetPublicId;

    const deleteImage = await deleteFromCloudinary(publicId);

    if (!deleteImage) {
      return res.status(400).json({
        success: false,
        message: "Error deleting image from Cloud",
      });
    }

    await Image.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image. Please try again:::", error);
    res.status(500).json({
      success: false,
      message: "Error deleting image. Please try again",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchAllImages,
  deleteImage,
};
