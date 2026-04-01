import prisma from "../configs/prisma.js";

export const addRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sellerId, rating, review } = req.body;

        if(!sellerId || !rating) return res.status(400).json({message: "sellerId and rating are required"});
        if (userId === sellerId) return res.status(400).json({message: "You cannot rate yourself"});
        if(rating < 1 || rating > 5) return res.status(400).json({message: "Rating must be between 1 and 5"});

        // Upsert to ensure one rating per seller per user
        const newRating = await prisma.rating.upsert({
            where: {
                reviewerId_sellerId: {
                    reviewerId: userId,
                    sellerId
                }
            },
            update: {
                rating: parseInt(rating),
                review
            },
            create: {
                reviewerId: userId,
                sellerId,
                rating: parseInt(rating),
                review
            }
        });

        return res.status(201).json({ message: "Seller rated successfully", newRating });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const getSellerRatings = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const ratings = await prisma.rating.findMany({
            where: { sellerId },
            include: {
                reviewer: {
                    select: { email: true, name: true, image: true, id: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const aggr = await prisma.rating.aggregate({
            where: { sellerId },
            _avg: { rating: true },
            _count: { rating: true }
        });

        return res.status(200).json({ 
            ratings, 
            averageRating: aggr._avg.rating || 0,
            totalRatings: aggr._count.rating || 0
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
