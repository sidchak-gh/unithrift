import jwt from "jsonwebtoken";
import prisma from "../configs/prisma.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          campus: true,
        },
      });

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const verifyAdminRole = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Not authorized, no user attached" });
        }
        
        const adminEmails = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.split(",") : [];
        const isAdmin = adminEmails.includes(user.email);
        
        if (isAdmin) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden: Admin access requested" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}