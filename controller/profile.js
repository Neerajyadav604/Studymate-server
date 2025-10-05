const Profile = require("../models/profileSchema");
const User = require("../models/userModel");
const Course = require("../models/course"); // needed for unenroll
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/courseProgress")

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      gender, 
      dateOfBirth, 
      about, 
      contactNumber 
    } = req.body;
    
    console.log("Received data:", { 
      firstName, 
      lastName, 
      gender, 
      dateOfBirth, 
      about, 
      contactNumber 
    });
    
    const id = req.user.id;

    // Find the user
    const userDetails = await User.findById(id);
    
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update User fields (firstName, lastName)
    if (firstName) userDetails.firstName = firstName;
    if (lastName) userDetails.lastName = lastName;

    // Get the profile ID
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Update Profile fields
    if (gender) profileDetails.gender = gender;
    if (dateOfBirth) {
  const [year, month, day] = dateOfBirth.split('-');
  profileDetails.dateOfBirth = new Date(year, month - 1, day);
}

    if (about) profileDetails.about = about;
    if (contactNumber) profileDetails.contactNumber = contactNumber;

    // Save both documents
    await userDetails.save();
    await profileDetails.save();

    // Populate the updated user with profile details
    const updatedUser = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails: updatedUser,
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
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
exports.updateDisplayPicture = async (req, res) => {
  console.log("req.headers:", req.headers);
console.log("req.body:", req.body);
console.log("req.files:", req.files);
console.log("req.user:", req.user);


  try { console.log("====================yaha tak to chal raha hai==============")
    console.log(req.files.displayPicture)
    
    const displayPicture = req.files.displayPicture
     console.log("====================yaha tak to chal raha hai==============")
    
    console.log(displayPicture);
       
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    console.log("USER:", req.user);  
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
      
    })
  }
}
function convertSecondsToDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs > 0 ? hrs + "h " : ""}${mins}m ${secs}s`;
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "Subsection",
          },
        },
      })
      .exec()

      console.log("UserId :",userDetails)
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    console.log("Length :",userDetails.courses.length)
     console.log("Length :",userDetails.courses.length)
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].Subsection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].Subsection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}