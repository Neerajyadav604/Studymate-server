const nodemailer = require("nodemailer");

const mailSender = async (email , title, body)=>{

    try{
        const transporter =nodemailer.createTransport({
host:process.env.MAIL_HOST,
auth:{
   user:process.env.MAIL_USER,
   pass:process.env.MAIL_PASS
},
        })

       let info = await transporter.sendMail({
  from: `"StudyMate" <${process.env.MAIL_USER}>`,  // 👈 Correct format
  to: email,
  subject: title,
  html: body,
});

        console.log(info)
       return info;
    }catch(e){
console.error(e);
    }
}

module.exports = mailSender;