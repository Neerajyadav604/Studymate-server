const subsection = require("../models/subSection");

const section = require("../models/section");

const {uploadImageToCloudinary} = require("../utils/imageUploader");
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files?.video;

    // Validation
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Upload video to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

    // Create sub-section
    const subSectionDetails = await subsection.create({
      title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // Add sub-section reference to the parent section
    const updatedSection = await section.findByIdAndUpdate(
      sectionId,
      { $push: { Subsection: subSectionDetails._id } },
      { new: true }
    ).populate("Subsection"); // populate to get full sub-section objects

    // Return updated section
    return res.status(200).json({
      success: true,
      message: "Subsection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Server error12",
      error: error.message,
    });
  }
};



// Update SubSection Controller
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, description, timeDuration } = req.body;
    let videoFile = req.files ? req.files.videoFile : null;

    // Validate
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId is required",
      });
    }

    // Prepare update object
    let updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (timeDuration) updateData.timeDuration = timeDuration;

    // If video is uploaded, upload to Cloudinary and update URL
    if (videoFile) {
      const uploadDetails = await uploadImageToCloudinary(
        videoFile,
        process.env.FOLDER_NAME
      );
      updateData.videoUrl = uploadDetails.secure_url;
    }

    // Update subsection
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      updateData,
      { new: true }
    );

    if (!updatedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
      data: updatedSubSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    // Validate
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId and sectionId are required",
      });
    }

    // Delete subsection
    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    // Remove reference from parent section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subsection: subSectionId } },
      { new: true }
    ).populate("subsection");

    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
      data: updatedSection, // returns section with remaining subsections
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};