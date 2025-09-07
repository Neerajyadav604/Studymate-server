const { instance } = require("../config/RazorPay");
const Course = require("../models/course");
const User = require("../models/userModel");
const mailSender = require("../utils/mailsender");
const { Purchaseemailtemplate } = require("../mail/Purchaseemailtemplate");
const mongoose = require("mongoose");
const crypto = require("crypto");


exports.CapturePayment = async (req, res) => {
 
    const { course_id } = req.body;
    const userId = req.user.id;

    // Validate request
    if (!course_id) {
        console.log(course_id)
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    let course;

    try {
      course = await Course.findById(course_id);

      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Could not find course",
        });
      }

      //user already pay for the same course

      const uid = new mongoose.Types.ObjectId;

      if(course.studentsEnrolled.includes(uid))
      {
        return res.status(400).json({
            success:false,
             message:"student is already enrolled "
        })
      };


    } catch (error) {
      // You may want to log this error for debugging
      console.error("Error finding course:", error);
    }

//order create
    const amount = course.price;
const currency = "INR";

const options = {
    amount:amount*100,
    currency,
    receipt:Math.random(Date.now()).toString(),
    notes:{
        courseId: course_id,
        userId,
    }

};

try {
    
    const paymentresponse = await instance.orders.create(options);
    console.log(paymentresponse);

return res.json({
    success:true,
    courseName:course.courseName,
    courseDescription:course.courseDescription,
    courseThumbnail:course.courseThumbnail,
    orderid:paymentresponse.id,
    currency:paymentresponse.currency,
    amount:paymentresponse.amount
})


} catch (error) {
    console.log(error);
     res.json({
        success:false,
        message:"Could not initiate order"
    });
}



  };
  



exports.verifysiginature = async(req,res)=>{

    const webhooksecret = "12345678";

const signature = req.headers["x-razorpay-signature"];

const body = {
  amount: 49900,
  amount_due: 49900,
  amount_paid: 0,
  attempts: 0,
  created_at: 1756615492,
  currency: 'INR',
  entity: 'order',
  id: 'order_RBoY32JFNyvK1a',
  notes: {
    courseId: '68b1de63c7662f7e7729979a',
    userId: '68b3c7ca47784d908f0e0f5b'
  },
  offer_id: null,
  receipt: '0.24914973229979864',
  status: 'created'
};


 const shasum = crypto.createHmac("sha256",webhooksecret);

 shasum.update(JSON.stringify(req.body));

 const digest = shasum.digest("hex");
 console.log("digest :",digest);


 if(signature === digest){
    console.log("payment is authorised");

const {courseId,userId} =  req.body.payload.entity.notes;

try {

//find the course and enroll the course in it


const enrolledcourse = await  Course.findOneAndUpdate(
                                                      {_id:courseId},
                                                      {$push:{studentEnrolled:userId}},
                                                      {new:true}
                                                );

              if(!enrolledcourse){
                return res.status(500).json({
                    success:false,
                    messgae:"Course not found",
                });
              }          
            
              
              console.log(enrolledcourse);
              // find the student and add the coure to their list enrolled course 

              const enrolledstudent = await User.findOneAndUpdate({_id:userId},
                                                                  {$push:{course:courseId}},
                                                                   {new:true}   );

                   console.log(enrolledstudent); 
                   
                   const emailResponse = await mailSender(
                    enrolledstudent.email,
                    "Congratulation from Studymate",
                    "congratulation, you are onborded into new studymate course "
                   );
                   return res.status(200).json({
                    success:true,
                    message:"Siginature verified and course added"

                   })

    
} catch (error) {

console.log(error);
return res.status(400).json({
    success:false,
    message:error.message,
})

}

 }else{
return res.status(400).json({
    success:false,
    messasge:"Signature cannot be verified"
})


 }

};

