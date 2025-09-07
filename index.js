const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database.js");
const routes = require("./routes/studymateroutes.js");
const { cloudinaryConnect } = require("./config/cloudinary.js");
const fileUpload = require("express-fileupload");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect to database
connectDB();

// Connect to Cloudinary
cloudinaryConnect();



app.use(fileUpload({
  useTempFiles: true,       // important for Cloudinary
  tempFileDir: "/tmp/",     // temp folder for uploads
}));


// Mount all API routes under /api
app.use("/api/v1", routes);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
