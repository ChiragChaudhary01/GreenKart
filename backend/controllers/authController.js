import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const generateToken = (user_id, role) => {
  return jwt.sign({ user_id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const sendOTPMail = async function (email, otp) {
  try {
    const transpoter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transpoter.verify();

    await transpoter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "varify your account",
      text: `Hello, User
  
  Thank you for registering on GreenKart.
  To complete your registration, please verify your email using the One-Time Password (OTP) below:
  
  OTP: ${otp}
  
  This OTP is valid for the next 5 minutes.
  If you did not request this, please ignore this email.
  
  Regards,
  Chirag Chaudhary
  GreenKart Team`,
    });
  } catch (error) {
    console.error("Error in sending mail");
    throw error;
  }
};

const authController = {
  signup: async (req, res) => {
    const { user_name, email, password, phone, role } = req.body;

    if (!user_name || !email || !password || !role || !phone) {
      return res.status(400).json({ error: "All fields required" });
    }

    // check if user allready exists
    try {
      const result = await UserModel.findByEmail(email);

      if (result.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // hash password
      const hashPassword = await bcrypt.hash(password, 10);

      const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins later
      console.log("Date in signup:", otpExpires);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // if not, create new user
      const insertResult = await UserModel.createUser(
        user_name,
        email,
        hashPassword,
        phone,
        role,
        otp,
        otpExpires,
        false
      );

      await sendOTPMail(email, otp);

      res.status(200).json({
        message: "User created",
        user_id: insertResult.insertId,
        user_name,
        email,
        role,
      });
    } catch (error) {
      console.error("Error in creating account:", error);
      res.status(500).json({ error: "Server Error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "All fields are requeired" });

    try {
      const result = await UserModel.findByEmail(email);
      if (result.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ error: "Please enter correct password" });

      if (user.isVerified == false) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins later
        const updateData = {
          otp,
          otpExpires,
        };

        await UserModel.updateUser(user.user_id, updateData);

        await sendOTPMail(email, otp);

        return res.status(200).json({
          user_id: user.user_id,
          user_name: user.user_name,
          email: user.email,
          role: user.role,
          message: `${user.user_name}, otp send to your mail. Please verify your Email Acount first`,
        });
      }

      const Token = generateToken(user.user_id, user.role);

      res.cookie("Token", Token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
      });

      res.status(201).json({
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        isVerified: true,
        Token,
        message: "Login sucssesfully",
      });
    } catch (error) {}
  },
  resendOTP: async (req, res) => {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ error: "all fields are required" });
    try {
      const result = await UserModel.findByEmail(email);
      if (result.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const user = result[0];

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins later
      const updateData = {
        otp,
        otpExpires,
      };

      await UserModel.updateUser(user.user_id, updateData);

      await sendOTPMail(email, otp);

      return res.status(200).json({
        user_id: user.user_id,
        isVerified: false,
        user_name: user.user_name,
        email: user.email,
        message: `${user.user_name}, otp send to your mail. Please verify your Email Acount first`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  verifyOTP: async (req, res) => {
    const { otp, email } = req.body;

    try {
      const result = await UserModel.findByEmail(email);
      if (result.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const user = result[0];

      // if already verified still generate the token and send
      if (user.isVerified) {
        const Token = generateToken(user.user_id, user.role);

        res.cookie("Token", Token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
        });

        return res.json({ message: "Already verified" });
      }

      if (user.otp != otp)
        return res.status(400).json({ error: "Invelid OTP" });

      console.log(
        "date in otp:",
        new Date(user.otpExpires).getTime(),
        Date.now()
      );
      if (Date.now() > user.otpExpires)
        return res.status(400).json({ error: "OTP is expires" });

      const updateData = {
        isVerified: true,
        otp: null,
        otpExpires: null,
      };

      const updateResult = await UserModel.updateUser(user.user_id, updateData);

      const Token = generateToken(user.user_id, user.role);

      res.cookie("Token", Token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
      });

      res.status(200).json({
        message: "User verified Successfully",
        user_name: user.user_name,
        user_id: user.user_id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: "all fields are required" });
    try {
      const result = await UserModel.findById(req.user.user_id);
      const user = result[0];
      console.log("result", result);
      console.log("user", user);

      if (!user) return res.status(404).json({ error: "User not found" });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ error: "Please enter correct old password" });

      const hashPassword = await bcrypt.hash(newPassword, 10);
      console.log("hashPassword:", hashPassword);

      const updatePassword = {
        password: hashPassword,
      };

      await UserModel.updateUser(req.user.user_id, updatePassword);

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "server error" });
    }
  },
};

export default authController;
