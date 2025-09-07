const mongoose = require("mongoose");
// models/otp.js
const mailSender = require("../utils/mailsender");


const otpSchema = new  mongoose.Schema({
    
email:{
    type:String,
    required:true,
},
otp:{
    type:String,
    required:true,

}, 
createdAt:{
    type:Date,
    default:Date.now(),
    exripres:5*60,
}
});

async function sendVerificationEmail(email,otp){

    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyMates",otp)
         console.log("Email Send Successfully ✅",mailResponse)
    }catch(e){
        console.log("error occured while sending mail",e);
        throw e;
    }


    
}

otpSchema.pre("save", async function(next){
        await sendVerificationEmail(this.email,this.otp);
        next();
    })

module.exports = mongoose.model("Otp",otpSchema);