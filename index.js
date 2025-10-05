const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database.js");
const routes = require("./routes/studymateroutes.js");
const { cloudinaryConnect } = require("./config/cloudinary.js");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const passport = require("passport");

// 👇 this line will run your passport.js config and register the Google strategy
require("./config/Passport.jsx");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Session secret (separate from Google secret!)
const Secret = process.env.GOOGLE_CLIENT_SECRET || "supersecret";

// ------------------ Middleware ------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: Secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// ------------------ DB & Cloudinary ------------------
connectDB();
cloudinaryConnect();

// ------------------ File Upload ------------------
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ------------------ Routes ------------------
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
