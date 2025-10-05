const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    // Input validation
    console.log(file)
    if (!file) {
      throw new Error("No file provided");
    }

    if (!file.tempFilePath) {
      throw new Error("File tempFilePath not found. Make sure express-fileupload is configured correctly.");
    }

    const options = { folder };
    
    if (height) {
      options.height = height;
    }
    
    if (quality) {
      options.quality = quality;
    }

    options.resource_type = "auto";

    console.log("Uploading to Cloudinary with options:", options);
    
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    
    console.log("Cloudinary upload successful:", result.public_id);
    
    return result;

  } catch (e) {
    console.error("Cloudinary upload error:", e);
    throw new Error(`Failed to upload image to Cloudinary: ${e.message}`);
  }
};