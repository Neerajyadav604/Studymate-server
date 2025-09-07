const Course = require("../models/course");
const Category = require("../models/category");
const User = require("../models/userModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;
    console.log(courseName);
    console.log(courseDescription);
    console.log(tag);


    const thumbnail = req.files?.thumbnailimage; // if using express-fileupload
    console.log(thumbnail);

    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Upload to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const userId = req.user.id; // ✅ fixed
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const tagDetails = await Category.findById(tag);

   

    try {
       if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
        
      });
    }
    } catch (error) {
      console.log(error);
    }

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      tagDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "🎉📚 New Course Created Successfully",
      course: newCourse,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Cannot create the course",
      error: e.message,
    });
  }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Fetched all the courses successfully",
      courses: allCourses,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Failed to get all the courses",
    });
  }
};

// Get Course Details
exports.getAllCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("tag")
      .populate("ratingAndReviews") // ✅ match your schema field
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      course: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
      error: error.message,
    });
  }
};
