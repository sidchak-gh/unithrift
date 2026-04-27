import prisma from "../configs/prisma.js";

export const getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const chats = await prisma.chat.findMany({
            where: {
                OR: [
                    { chatUserId: userId },
                    { ownerUserId: userId }
                ]
            },
            include: {
                listing: {
                    select: { id: true, title: true, images: true }
                },
                ownerUser: {
                    select: { id: true, name: true, image: true, campus: true }
                },
                chatUser: {
                    select: { id: true, name: true, image: true, campus: true }
                }
            },
            orderBy: {
                updatedAt: "desc"
            }
        });

        res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching chats" });
    }
};

export const initiateChat = async (req, res) => {
    try {
        const chatUserId = req.user.id;
        const { listingId, sellerId, chatId } = req.body;

        const includeRelations = {
            ownerUser: { select: { id: true, name: true, image: true, campus: true } },
            chatUser: { select: { id: true, name: true, image: true, campus: true } },
            messages: { orderBy: { createdAt: "asc" } },
            listing: { select: { id: true, title: true, status: true, images: true, ownerId: true } }
        };

        if (chatId) {
            const chat = await prisma.chat.findUnique({
                where: { id: chatId },
                include: includeRelations
            });
            return res.status(200).json(chat);
        }

        if (chatUserId === sellerId) {
            return res.status(400).json({ success: false, message: "You cannot chat with yourself." });
        }

        let chat = await prisma.chat.findUnique({
            where: {
                chatUserId_ownerUserId_listingId: {
                    chatUserId: chatUserId,
                    ownerUserId: sellerId,
                    listingId: listingId
                }
            },
            include: includeRelations
        });

        if (!chat) {
            const newChat = await prisma.chat.create({
                data: {
                    chatUserId,
                    ownerUserId: sellerId,
                    listingId: listingId,
                }
            });
            chat = await prisma.chat.findUnique({
                where: { id: newChat.id },
                include: includeRelations
            });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error initiating chat" });
    }
};

export const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        // Verify user is part of chat
        const chat = await prisma.chat.findUnique({
            where: { id: chatId }
        });

        if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });

        if (chat.chatUserId !== userId && chat.ownerUserId !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized access to chat" });
        }

        const messages = await prisma.message.findMany({
            where: { chatId: chatId },
            orderBy: { createdAt: "asc" }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching messages" });
    }
};
