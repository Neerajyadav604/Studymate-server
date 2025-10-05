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
    ref: "Section"
  }],
  ratingAndReviews: [{
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
  tag:{
		type: [String],
		required: true,
	},
  category: {  // Optional single category
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},

},
 {
  timestamps: true
});

module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);
