import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  verifyOtp,
  resendOtp,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);       // Step 1 — sends OTP
router.post("/verify-otp", verifyOtp);        // Step 2 — verifies OTP, creates account
router.post("/resend-otp", resendOtp);        // Resend OTP
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
