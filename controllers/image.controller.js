const express = require("express");
const { uploadToCloudinary } = require("../helpers/cloudinary.helper");
const Image = require("../models/image.model");

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

module.exports = {
  uploadImageController,
};
