const cloudinary = require("../config/cloudinary.config");

const uploadToCloudinary = async (imagepath) => {
  const uploadOptions = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    const image = await cloudinary.uploader.upload(imagepath, uploadOptions);
    return { url: image.secure_url, publicId: image.public_id };
  } catch (error) {
    console.error("Error uploading image to cloudinary:::", error);
    throw new Error("Error uploading Image");
  }
};

module.exports = {
  uploadToCloudinary,
};
