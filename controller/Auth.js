const User = require("../models/userModel");
const Otp = require("../models/otp");
const otpgenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwttoken = require("jsonwebtoken");
const Profile = require("../models/profileSchema");
require("dotenv").config();

// Send OTP
exports.SendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,  // ✅ fixed
        message: "User already Registered 👨🏻✅",
      });
    }

    // generate otp
    let otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP Generated:", otp);

    // ensure unique OTP
    let result = await Otp.findOne({ otp });
    while (result) {
      otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await Otp.findOne({ otp });
    }

    const otpPayload = { email, otp };
    await Otp.create(otpPayload);

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// Sign Up
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All Fields Required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,  // ✅ fixed typo
        message: "Password does not match confirmPassword 🔒❌",
      });
    }

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({
        success: false,
        message: "User Already Registered",
      });
    }

    const recentotp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("Recent OTP:", recentotp);

    if (recentotp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found 🚫🔢",
      });
    }

    if (otp !== recentotp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP 🔢❌",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const profiledetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contactNumber: contactNumber || null, // ✅ store contact number if given
    });

    const userdetails = await User.create({
      firstName,
      lastName,
      email,
      password: hashedpassword,
      accountType,
      additionalDetails: profiledetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    res.status(200).json({
      success: true,
      message: "User registered Successfully",
      userdetails,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "User cannot be registered, please try again later",
      error: e.message,
    });
  }
};

// Log In
exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails").exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };

    const token = jwttoken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot log in, please try again later",
      error: error.message,
    });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ stick to lowercase req.user
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};
