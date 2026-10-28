import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);       // Step 1 — sends OTP
router.post("/verify-otp", verifyOtp);        // Step 2 — verifies OTP, creates account
router.post("/resend-otp", resendOtp);        // Resend OTP
router.post("/forgot-password", forgotPassword); // Step 1: Send reset OTP
router.post("/reset-password", resetPassword);   // Step 2: Verify OTP & update password
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
