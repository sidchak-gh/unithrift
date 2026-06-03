import prisma from "../configs/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/mailer.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ─── REGISTER — Step 1: Send OTP ─────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { email, password, name, campus } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Check if a fully verified account already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password now so we don't store plaintext in OtpVerification
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert so repeated /register calls refresh the OTP
    await prisma.otpVerification.upsert({
      where: { email },
      update: { otp, expiresAt, name, passwordHash, campus: campus || null },
      create: { email, otp, expiresAt, name, passwordHash, campus: campus || null },
    });

    await sendOtpEmail(email, otp, name);

    res.status(200).json({ message: "OTP sent to your email. Please verify to complete registration." });
  } catch (error) {
    console.error("Register (send OTP) error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// ─── VERIFY OTP — Step 2: Confirm OTP, create account ────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const record = await prisma.otpVerification.findUnique({ where: { email } });

    if (!record) {
      return res.status(400).json({ message: "No pending verification found for this email. Please register first." });
    }

    if (new Date() > record.expiresAt) {
      await prisma.otpVerification.delete({ where: { email } });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // OTP valid — create the user
    const user = await prisma.user.create({
      data: {
        email: record.email,
        name: record.name,
        password: record.passwordHash,
        campus: record.campus || null,
        isVerified: true,
      },
    });

    // Clean up OTP record
    await prisma.otpVerification.delete({ where: { email } });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      campus: user.campus,
      token: generateToken(user.id),
      message: "Email verified! Registration successful.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error during verification", error: error.message });
  }
};

// ─── RESEND OTP ───────────────────────────────────────────────────────────────
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const record = await prisma.otpVerification.findUnique({ where: { email } });

    if (!record) {
      return res.status(400).json({ message: "No pending verification found. Please register first." });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpVerification.update({
      where: { email },
      data: { otp, expiresAt },
    });

    await sendOtpEmail(email, otp, record.name);

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error while resending OTP", error: error.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        campus: user.campus,
        token: generateToken(user.id),
        message: "Login successful",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

// ─── GET ME ───────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        campus: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
