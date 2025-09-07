const express = require("express");

const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/auth.js");

// Controllers
const { SendOTP, signUp, logIn, changePassword } = require("../controller/Auth.js");
const { resetPasswordToken, resetpassword } = require("../controller/ResetPassword.js");
const { createCategory, showAllCategories, categoryPageDetails } = require("../controller/Category.js");
const { createCourse, getAllCourses, getAllCourseDetails } = require("../controller/courses.js");
const { CapturePayment, verifysiginature } = require("../controller/payment.js");
const { updateProfile, deleteaccount, getalluserdetailes } = require("../controller/profile.js");
const { createRating, getAverageRating, getAllRating } = require("../controller/RatingAndReview.js");
const { createsection, updatesection, deleteSection } = require("../controller/section.js");
const { createsubsection, updateSubSection, deleteSubSection } = require("../controller/subSection.js");




// ------------------ AUTH ROUTES ------------------
router.post("/auth/send-otp", SendOTP);
router.post("/auth/signup", signUp);
router.post("/auth/login", logIn);
router.post("/auth/change-password", auth, changePassword);

router.post("/auth/forgot-password", resetPasswordToken);
router.post("/auth/reset-password", resetpassword);

// ------------------ CATEGORY ROUTES ------------------
router.post("/category/create", auth, authorizeRoles("Admin"), createCategory);
router.get("/category/all", showAllCategories);
router.get("/category/:id", categoryPageDetails);

// ------------------ COURSE ROUTES ------------------
router.post("/course/create", auth,  createCourse);
router.get("/course/all", getAllCourses);
router.get("/course/:id", getAllCourseDetails);

//to capture payment (requires user to be logged in)
router.post("/capture-payment", auth, CapturePayment);

// Razorpay webhook route (signature verification)
router.post("/verify-signature", verifysiginature);


// ------------------ USER PROFILE ROUTES ------------------
router.put("/user/profile/update", auth, updateProfile);
router.delete("/user/delete", auth, deleteaccount);
router.get("/user/details", auth, getalluserdetailes);

// Route to request a password reset link
router.post("/forgot-password", resetPasswordToken);

// Route to reset the password using token
router.post("/reset-password", resetpassword);

// ------------------ RATING ROUTES ------------------
router.post("/rating/create", auth, authorizeRoles("Student"), createRating);
router.post("/rating/average", getAverageRating);
router.get("/rating/all", getAllRating);

// ------------------ SECTION ROUTES ------------------
router.post("/section/create", auth, authorizeRoles("Instructor"), createsection);
router.put("/section/update", auth, authorizeRoles("Instructor"), updatesection);
router.delete("/section/delete", auth, authorizeRoles("Instructor"), deleteSection);

// ------------------ SUBSECTION ROUTES ------------------
router.post("/subsection/create", auth, authorizeRoles("Instructor"), createsubsection);
router.put("/subsection/update", auth, authorizeRoles("Instructor"), updateSubSection);
router.delete("/subsection/delete", auth, authorizeRoles("Instructor"), deleteSubSection);

// Export the router
module.exports = router;
