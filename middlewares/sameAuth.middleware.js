const { mongoose } = require("mongoose");
const Image = require("../models/image.model");

const sameUserAuth = async (req, res, next) => {
  const { userId } = req.userInfo;
  const imageId = req.params.id;
  try {
    const targetImage = await Image.findById(imageId);

    if (!targetImage)
      return res.status(404).json({
        success: false,
        message: "Image with provided Id does not exist",
      });

    if (targetImage.uploadedBy.toString() !== userId)
      return res.status(401).json({
        success: false,
        message: "This user is not allowed to delete the selected image",
      });

    req.assetPublicId = targetImage.publicId;
    next();
  } catch (error) {
    console.error("Error authenticating user");
  }
};

module.exports = sameUserAuth;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhiYTMzNWFjYjExNmQ4Njc0YzM5ZjIiLCJ1c2VybmFtZSI6Im5ldyBhZG1pbiB1c2VyMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNzIwNTcxMSwiZXhwIjoxNzM3MjA5MzExfQ.kVAcgntcz0Qke-ghUWY4l3-Pe0VFzJ-TzHim1G1uTLo
