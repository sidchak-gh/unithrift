import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "./configs/prisma.js";

import authRouter from "./routes/authRoutes.js";
import listingRouter from "./routes/listingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import ratingRouter from "./routes/ratingRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

const app = express();
const server = createServer(app);

const allowedOrigins = process.env.CLIENT_URL
    ? [process.env.CLIENT_URL, "http://localhost:5173"]
    : ["http://localhost:5173"];

const io = new Server(server, {
    cors: { origin: allowedOrigins, credentials: true }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins, credentials: true }));


app.get("/health", (req, res) => {
    res.send("UniThrift API is running...");
});



app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/chat", chatRouter);


const onlineUsers = new Map();

io.on("connection", (socket) => {

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });


    socket.on("send-message", async (data) => {
        try {
            const { chatId, senderId, receiverId, message } = data;


            const savedMessage = await prisma.message.create({
                data: {
                    chatId,
                    sender_id: senderId,
                    message,
                }
            });


            await prisma.chat.update({
                where: { id: chatId },
                data: {
                    lastMessage: message,
                    isLastMessageRead: false,
                    lastMessageSenderId: senderId
                }
            });


            const receiverSocket = onlineUsers.get(receiverId);
            if (receiverSocket) {
                socket.to(receiverSocket).emit("receive-message", savedMessage);
            }
        } catch (error) {
            console.error("Socket error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        for (let [id, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(id);
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`UniThrift Server is running on port ${PORT}`);
});