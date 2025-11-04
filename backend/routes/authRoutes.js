import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

// POST /auth/signup
authRouter.post("/signup", authController.signup);

// POST /auth/verify-otp
authRouter.post("/verify-otp", authController.verifyOTP);

// post /auth/login
authRouter.post("/login", authController.login);

// post /auth/resend-otp
authRouter.post("/resend-otp", authController.resendOTP);

// post /auth/change-password
authRouter.post(
  "/change-password",
  authMiddleware,
  authController.changePassword
);
