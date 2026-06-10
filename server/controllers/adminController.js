import prisma from "../configs/prisma.js";


// controller to check if user is admin
export const isAdmin = async (req, res) => {
    try {
        return res.json({ isAdmin: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// get admin dashboard stats
export const dashboard = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const activeListings = await prisma.listing.count({ where: { status: "active" } });
        const pendingListings = await prisma.listing.count({ where: { status: "pending" } });
        const soldListings = await prisma.listing.count({ where: { status: "sold" } });

        return res.status(200).json({
            users: totalUsers,
            activeListings,
            pendingListings,
            soldListings
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// get all listings 
export const getAllListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            include: { owner: true },
            orderBy: { createdAt: "desc" }
        });

        return res.status(200).json({ listings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// get all pending listings
export const getPendingListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { status: "pending" },
            include: { owner: true },
            orderBy: { createdAt: "desc" }
        });

        return res.status(200).json({ listings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// change listing status (approve or reject)
export const changeStatus = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { status, reason } = req.body; // reason is optional, for rejections

        if (status !== "active" && status !== "rejected") {
            return res.status(400).json({ message: "Invalid status provided" });
        }

        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        });

        if (!listing) return res.status(404).json({ message: "Listing not found" });

        await prisma.listing.update({
            where: { id: listingId },
            data: {
                status,
                // When admin rejects: save reason, set aiApproved null (admin = null, gemini = false)
                // When admin approves: clear any previous rejection reason
                aiReason: status === "rejected" ? (reason || "Rejected by admin") : null,
                aiApproved: status === "rejected" ? null : listing.aiApproved,
            }
        });

        return res.status(200).json({ message: "Listing status updated successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
