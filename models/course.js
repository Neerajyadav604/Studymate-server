const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
        required: true
    },
    courseDescription: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    whatYouWillLearn: {
        type: String,
        required: true
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"  // Fixed capitalization and made it an array
    }],
    ratingAndReviews: [{  // Fixed typo and made it an array
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    }],
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
    },
    tag: {  // Removed category since you're using tag
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",  // Fixed reference
        required: true
    },
    studentsEnrolled: [{  // Fixed typo and made it an array
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  // Fixed typo in "ref"
    }]
}, {
    timestamps: true  // Added timestamps for created/updated dates
});

module.exports = mongoose.model("Course", courseSchema);