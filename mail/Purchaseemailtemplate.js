exports.CoursePurchasetemplate = (courseName , firstName)=>{` <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Purchase</title>
</head>
<body style="background-color:#f3f4f6; margin:0; padding:20px; font-family:Arial, sans-serif;">

  <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb; box-shadow:0 4px 6px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(to right,#4f46e5,#3b82f6); padding:24px; color:white; display:flex; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="https://via.placeholder.com/40" alt="Logo" style="height:40px; width:40px; border-radius:50%; background:white; padding:4px;">
        <h1 style="margin:0; font-size:20px; font-weight:bold;">YourEdTech</h1>
      </div>
      <span style="font-size:14px; opacity:0.9;">Learning made simple</span>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h2 style="font-size:22px; font-weight:bold; color:#111827; margin:0 0 16px;">🎉 Thank You for Your Purchase!</h2>
      <p style="color:#374151; margin:0 0 16px; line-height:1.6;">
        Hi <strong>{${firstName}}</strong>,
      </p>
      <p style="color:#374151; margin:0 0 16px; line-height:1.6;">
        We’re excited to let you know that your purchase was successful.  
        You now have full access to the course:
      </p>

      <!-- Course Highlight Card -->
      <div style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:16px; margin-bottom:24px;">
        <p style="color:#6b7280; font-size:14px; margin:0 0 4px;">Enrolled Course:</p>
        <h3 style="font-size:18px; font-weight:600; color:#111827; margin:0;">{${courseName}}</h3>
      </div>

      <!-- CTA Button -->
      

      <p style="color:#374151; margin-top:24px; line-height:1.6;">
        If you have any questions or need help, our support team is just one click away.  
        Wishing you the best in your learning journey!
      </p>
    </div>

    <!-- Divider -->
    <div style="border-top:1px solid #e5e7eb;"></div>

    <!-- Footer -->
    <div style="padding:24px; background-color:#f9fafb; font-size:14px; color:#4b5563;">
      <p style="margin:0 0 8px;">📧 <a href="mailto:support@youredtech.com" style="color:#2563eb; text-decoration:none;">support@youredtech.com</a></p>
      <p style="margin:0 0 8px;">📞 01234 567 890</p>
      <p style="margin:0; font-weight:600; color:#111827;">YourEdTech</p>

      <div style="margin-top:24px; display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:8px;">
          <img src="https://via.placeholder.com/28" alt="Logo" style="height:28px; width:28px; border-radius:6px; background:white; padding:4px; border:1px solid #e5e7eb;">
          <span style="color:#374151;">YourEdTech</span>
        </div>
        <span style="font-style:italic; color:#4f46e5; font-weight:500;">Empowering learners everywhere</span>
      </div>
    </div>
  </div>

</body>
</html>
`} 