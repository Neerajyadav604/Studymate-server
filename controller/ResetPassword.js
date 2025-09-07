const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const mailsender = require("../utils/mailsender");

// Generate Reset Password Token
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your email is not registered with us",
      });
    }

    // generate token
    const urltoken = crypto.randomUUID();

    // update user with token & expiry
    user.token = urltoken;
    user.resetpasswordexpired = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // reset link
    const url = `http://localhost:3000/update-password/${urltoken}`;

    // send mail
    await mailsender(
      email,
      "Password Reset Link",
      `Click here to reset your password: ${url}`
    );

    return res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating reset link",
    });
  }
};

// Reset Password
exports.resetpassword = async (req, res) => {
  try {
    const { password, confirmpassword, token } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // find user with token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // check expiry
    if (user.resetpasswordexpired < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    }

    // hash new password
    const hashedpassword = await bcrypt.hash(password, 10);

    // update password and clear reset token
    user.password = hashedpassword;
    user.token = undefined;
    user.resetpasswordexpired = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
};
