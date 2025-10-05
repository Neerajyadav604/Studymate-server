const Section = require("../models/section");
const Course = require("../models/course");

exports.createsection = async (req, res) => {
  try {
    const { sectionName, courseID } = req.body;

    // Validate input
    if (!sectionName || !courseID) {
      console.log("sectionName :",sectionName)
      console.log("courseId :",courseID)
      return res.status(400).json({
        success: false,
        message: "Require all the fildes"
        
      });
    }

    // Create new section
    const newSection = await Section.create({ sectionName });

    // Push section into course content
    const updatedCourse = await Course.findByIdAndUpdate(
      courseID,
      { $push: { courseContent: newSection._id } },
      { new: true }
    ).populate("courseContent"); // optional: populate to see full section details

    return res.status(201).json({
      success: true,
      message: "Section created and added to course successfully",
      section: newSection,
      updatedCourse
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


exports.updatesection = async(req , res )=>{
  try{

const {sectionName,SectionId}=req.body;
if (!sectionName || !SectionId) {
      return res.status(400).json({
        success: false,
        message: "Required fields not found"
      });
    }

    const action = await Section.findByIdAndUpdate(SectionId,{sectionName},{new:true});
    return res.status(200).json({
      success:true,
      message:"Section Upadted Successfully ",
    })





  }catch(e){
console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
    
  }
}


exports.deleteSection = async(req,res)=>{
  try{

const{SectionId}= req.body;

await Section.findByIdAndDelete(SectionId);


return res.status(200).json({
  success:true,
  message:"Section deleted successfully"
})




  }catch(e){

console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}