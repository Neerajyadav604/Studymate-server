const Profile = require("../models/profileSchema");
const User = require("../models/userModel");
const Course = require("../models/course"); // needed for unenroll
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { gender, dateOfBirth, about, contact } = req.body;
    const id = req.user.id;

    if (!gender || !dateOfBirth || !about || !contact) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails; // ✅ correct spelling
    const profileDetails = await Profile.findById(profileId);

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profileDetails.gender = gender;
    profileDetails.dateOfBirth = new Date(dateOfBirth);
    profileDetails.about = about;
    profileDetails.contact = contact;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: profileDetails,
    });

    // 🔥 HW idea: You could also schedule account deletion using node-cron / Bull queue.
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: e.message,
    });
  }
};

// Delete Account
exports.deleteaccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🟢 Unenroll user from all courses
    const enrolledCourses = userDetails.courses; // assuming user has a courses array
    if (enrolledCourses?.length) {
      for (const courseId of enrolledCourses) {
        await Course.findByIdAndUpdate(courseId, {
          $pull: { studentEnrolled: id },
        });
      }
    }

    // Delete profile + user
    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User account and profile deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: e.message,
    });
  }
};

// Get All User Details
exports.getalluserdetailes = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails") // ✅ corrected
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details found successfully",
      user: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
