import prisma from "../configs/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, campus } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please compile all fields" });
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        campus: campus || null,
      },
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        campus: user.campus,
        token: generateToken(user.id),
        message: "Registration successful",
      });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

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
