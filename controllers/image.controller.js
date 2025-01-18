const { uploadToCloudinary } = require("../helpers/cloudinary.helper");
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
    const allImages = await Image.find({});
    if (!allImages)
      return res.status(404).json({
        message: "No images found. Please upload a new image",
      });

    res.status(200).json({
      success: true,
      data: allImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong. Please try again",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchAllImages,
};
