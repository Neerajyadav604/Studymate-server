const express = require("express");

const router = express.Router();
const passport = require("passport"); 

const { auth, authorizeRoles ,isInstructor,isStudent} = require("../middleware/auth.js");

// Controllers
const { SendOTP, signUp, logIn, changePassword } = require("../controller/Auth.js");
const { resetPasswordToken, resetpassword } = require("../controller/ResetPassword.js");
const { createCategory, showAllCategories, categoryPageDetails } = require("../controller/Category.js");
const { createCourse, getAllCourses, getAllCourseDetails,editCourse,getInstructorCourses,getFullCourseDetails ,deleteCourse,getCourseDetails} = require("../controller/courses.js");
const { capturePayment, verifyPayment,sendPaymentSuccessEmail } = require("../controller/payment.js");
const { updateProfile, deleteaccount, getalluserdetailes,updateDisplayPicture,getEnrolledCourses,  instructorDashboard} = require("../controller/profile.js");
const { createRating, getAverageRating, getAllRating } = require("../controller/RatingAndReview.js");
const { createsection, updatesection, deleteSection } = require("../controller/section.js");
const { createSubSection, updateSubSection, deleteSubSection } = require("../controller/subSection.js");
const {
  updateCourseProgress
} = require("../controller/courseProgress.js");


router.post("/course/updateCourseProgress", auth, isStudent, updateCourseProgress);





// ------------------ AUTH ROUTES ------------------
router.post("/auth/send-otp", SendOTP);
router.post("/auth/signup", signUp);
router.post("/auth/login", logIn);
router.post("/auth/changepassword", auth, changePassword);

router.post("/auth/reset-password-token", resetPasswordToken);
router.post("/auth/reset-password", resetpassword);

// ------------------ CATEGORY ROUTES ------------------
router.post("/category/create", auth, authorizeRoles("Admin"), createCategory);
router.get("/course/showAllCategories", showAllCategories);
router.post("/category/:id", categoryPageDetails);

// ------------------ COURSE ROUTES ------------------
router.post("/course/createCourse", auth,  createCourse);
router.get("/course/getAllCourses", getAllCourses);
router.post("/course/getCourseDetails", getAllCourseDetails);
router.post("/course/editCourse", auth, isInstructor, editCourse)
router.get("/course/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.post("/course/getFullCourseDetails", auth, getFullCourseDetails)
router.delete("/deleteCourse", deleteCourse)
router.post("/course/getCourseDetails", getCourseDetails)

//to capture payment (requires user to be logged in)
router.post("/payment/capturePayment", auth, capturePayment);

// Razorpay webhook route (signature verification)
router.post("/payment/verifyPayment",auth, verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);


// ------------------ USER PROFILE ROUTES ------------------
router.put("/profile/updateProfile", auth, updateProfile);
router.delete("/user/delete", auth, deleteaccount);
router.get("/user/details", auth, getalluserdetailes);
router.put("/profile/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/getEnrolledCourses", auth, getEnrolledCourses)


// Route to request a password reset link
router.post("/forgot-password", resetPasswordToken);

// Route to reset the password using token
router.post("/reset-password", resetpassword);

// ------------------ RATING ROUTES ------------------
router.post("/course/createRating", auth, authorizeRoles("Student"), createRating);
router.post("/rating/average", getAverageRating);
router.get("/rating/all", getAllRating);

// ------------------ SECTION ROUTES ------------------
router.post("/course/addSection", auth, authorizeRoles("Instructor"), createsection);
router.put("/course/updateSection", auth, authorizeRoles("Instructor"), updatesection);
router.delete("/course/deleteSection", auth, authorizeRoles("Instructor"), deleteSection);

// ------------------ SUBSECTION ROUTES ------------------
router.post("/course/addSubSection", auth, authorizeRoles("Instructor"), createSubSection);
router.put("/course/updateSubSection", auth, authorizeRoles("Instructor"), updateSubSection);
router.delete("/course/deleteSubSection", auth, authorizeRoles("Instructor"), deleteSubSection);

router.get("/profile/getEnrolledCourses", auth, getEnrolledCourses)

router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

const { contactUsController } = require("../controller/contactUsController.js")

router.post("/contact", contactUsController)





// Export the router
module.exports = router;
