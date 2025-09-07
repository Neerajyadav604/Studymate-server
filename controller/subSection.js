const subsection = require("../models/subSection");

const section = require("../models/section");

const {uploadImageToCloudinary} = require("../utils/imageUploader");
exports.createsubsection = async(req , res)=>{

    try{

const {sectionId,title,timeDuration,description} = req.body;

const video = req.files.videoFile;


if(!sectionId ||  !title || timeDuration || !description){
    return  res.status(400).json({
        success:false,
        message:"All filed required",
    })
};


const uploaddetailes = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

const subsectiondetailes = await subsection.create({
    title:title,
    timeDuration:timeDuration,
    description:description,
    videoUrl:uploaddetailes.secure_url,
});


const addsubsection = await section .findByIdAndUpdate(sectionId,{$push:{subsection:subsectiondetailes._id,}} ,{new:true});
console.log(addsubsection);

//HW: log updated section here after add populate


return res.status(200).json({
    success:true,
    message:"Subsection created successfully",
})


    }catch(e){
return res.status(500).json({
      success: false,
      message: "Server error",
      error: e.message
    });
    }
}



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