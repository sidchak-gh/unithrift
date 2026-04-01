import prisma from "../configs/prisma.js";

export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { listingId } = req.body;

        if(!listingId) return res.status(400).json({message: "listingId is required"});

        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId
                }
            }
        });

        if (existing) {
            await prisma.wishlist.delete({
                where: { id: existing.id }
            });
            return res.status(200).json({ message: "Removed from wishlist", isWishlisted: false });
        } else {
            await prisma.wishlist.create({
                data: {
                    userId,
                    listingId
                }
            });
            return res.status(201).json({ message: "Added to wishlist", isWishlisted: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const getMyWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlistedItems = await prisma.wishlist.findMany({
            where: { userId },
            include: {
                listing: {
                    include: { owner: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const listings = wishlistedItems.map(item => item.listing);

        return res.status(200).json({ listings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
