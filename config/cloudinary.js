// cloudinary.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // make sure this is at the top

const cloudinaryConnect = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  console.log("Cloudinary connected ✅");
};

module.exports = { cloudinary, cloudinaryConnect };
