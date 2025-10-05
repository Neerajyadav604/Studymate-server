const RatingAndReview = require("../models/ratingAndReview");
const Course = require("../models/course");
const mongoose = require("mongoose");

// Create Rating
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    console.log(req.user.id);
    console.log(rating,review,courseId);

    // Check if user is enrolled in the course
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    console.log(courseDetails);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    // Check if user already reviewed this course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Course is already reviewed by this user",
      });
    }

    // Create rating & review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // Push the rating into course model
    await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { ratingAndReviews: ratingReview._id } }, // store ObjectId
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      data: ratingReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Cannot rate and review the course",
    });
  }
};

// Get Average Rating
exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    } else {
      return res.status(200).json({
        success: true,
        averageRating: 0,
        message: "No ratings yet",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Cannot get average rating",
    });
  }
};

// Get All Ratings & Reviews
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course", // ✅ lowercase to match schema
        select: "courseName",
      })
      .sort({ rating: "desc" });

    if (!allReviews || allReviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ratings and reviews found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All ratings and reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Cannot fetch all ratings and reviews",
    });
  }
};