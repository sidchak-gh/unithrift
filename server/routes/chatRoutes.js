import express from "express";
import { getChatMessages, getUserChats, initiateChat } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserChats);
router.post("/init", protect, initiateChat);
router.get("/:chatId", protect, getChatMessages);

export default router;
