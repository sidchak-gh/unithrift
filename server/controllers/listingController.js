import cloudinary from "../configs/cloudinary.js";
import prisma from "../configs/prisma.js";
import { getRecommendations as computeRecommendations } from "../utils/recommender.js";
import { moderateListing } from "../utils/geminiModerator.js";


// Helper: upload a file buffer to Cloudinary
const uploadToCloudinary = (buffer, originalName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "uni-thrift",
                resource_type: "image",
                transformation: [{ width: 1280, crop: "limit", quality: "auto" }],
                public_id: `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

export const addListing = async (req, res) => {
    try {
        const userId = req.user.id;
        const itemDetails = JSON.parse(req.body.itemDetails);

        itemDetails.price = parseFloat(itemDetails.price);
        itemDetails.category = itemDetails.category.toLowerCase();
        itemDetails.condition = itemDetails.condition.toLowerCase();

        let images = [];
        if (req.files && req.files.length > 0) {
            images = await Promise.all(
                req.files.map((file) => uploadToCloudinary(file.buffer, file.originalname))
            );
        }

        // ── Gemini AI Moderation ──────────────────────────────────────────────
        const aiResult = await moderateListing({
            title: itemDetails.title,
            description: itemDetails.description,
            category: itemDetails.category,
            imageUrls: images,
        });

        // aiResult is null if Gemini API failed → fall back to manual review
        const status = aiResult === null ? "pending" : aiResult.approved ? "active" : "rejected";
        const aiApproved = aiResult?.approved ?? null;
        const aiReason = aiResult?.reason ?? null;
        // ─────────────────────────────────────────────────────────────────────

        const listing = await prisma.listing.create({
            data: {
                ownerId: userId,
                images,
                title: itemDetails.title,
                description: itemDetails.description,
                category: itemDetails.category,
                condition: itemDetails.condition,
                price: itemDetails.price,
                status,
                aiApproved,
                aiReason,
            }
        });

        const message = status === "active"
            ? "Item listed successfully! It's now live on the marketplace."
            : status === "rejected"
            ? `Your listing was not approved. Reason: ${aiReason}`
            : "Item listed successfully. Awaiting admin approval.";

        return res.status(201).json({ message, listing });

    } catch (error) {
        console.error("Add Listing Error:", error);
        return res.status(500).json({ message: error.code || error.message });
    }
};


export const getAllPublicListing = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { status: "active" },
            include: { owner: true },
            orderBy: { createdAt: "desc" },
        });

        return res.json({ listings: listings || [] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


export const getAllUserListing = async (req, res) => {
    try {
        const userId = req.user.id;
        const listings = await prisma.listing.findMany({
            where: { ownerId: userId, status: { not: "deleted" } },
            orderBy: { createdAt: "desc" },
        });

        return res.json({ listings: listings || [] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


export const updateListing = async (req, res) => {
    try {
        const userId = req.user.id;
        const itemDetails = JSON.parse(req.body.itemDetails);

        if (req.files && req.files.length + (itemDetails.images?.length || 0) > 5) {
            return res.status(400).json({ message: "You can upload maximum 5 images" });
        }

        itemDetails.price = parseFloat(itemDetails.price);
        itemDetails.category = itemDetails.category.toLowerCase();
        itemDetails.condition = itemDetails.condition.toLowerCase();

        const listingCheck = await prisma.listing.findFirst({
            where: { id: itemDetails.id, ownerId: userId }
        });

        if (!listingCheck) return res.status(404).json({ message: "Listing not found" });
        if (listingCheck.status === "sold") return res.status(400).json({ message: "Sold item cannot be updated" });

        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = await Promise.all(
                req.files.map((file) => uploadToCloudinary(file.buffer, file.originalname))
            );
        }

        const updatedImages = [...(itemDetails.images || []), ...newImages];

        // ── Gemini AI Re-Moderation on Edit ───────────────────────────────────
        const aiResult = await moderateListing({
            title: itemDetails.title,
            description: itemDetails.description,
            category: itemDetails.category,
            imageUrls: updatedImages,
        });

        const status = aiResult === null ? "pending" : aiResult.approved ? "active" : "rejected";
        const aiApproved = aiResult?.approved ?? null;
        const aiReason = aiResult?.reason ?? null;
        // ─────────────────────────────────────────────────────────────────────

        const listing = await prisma.listing.update({
            where: { id: itemDetails.id },
            data: {
                title: itemDetails.title,
                description: itemDetails.description,
                category: itemDetails.category,
                condition: itemDetails.condition,
                price: itemDetails.price,
                images: updatedImages,
                status,
                aiApproved,
                aiReason,
            }
        });

        const message = status === "active"
            ? "Listing updated and approved by AI!"
            : status === "rejected"
            ? `Listing updated but not approved. Reason: ${aiReason}`
            : "Listing updated. Awaiting re-approval.";

        return res.status(200).json({ message, listing });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUserListing = async (req, res) => {
    try {
        const userId = req.user.id;
        const { listingId } = req.params;

        const listing = await prisma.listing.findFirst({
            where: { id: listingId, ownerId: userId },
        });

        if (!listing) return res.status(404).json({ message: "Listing not found" });
        if (listing.status === "sold") return res.status(400).json({ message: "Sold item cannot be deleted" });

        await prisma.listing.update({
            where: { id: listingId },
            data: { status: "deleted" }
        });

        return res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const markSold = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const listing = await prisma.listing.findFirst({
            where: { id, ownerId: userId },
        });

        if (!listing) return res.status(404).json({ message: "Listing not found" });

        await prisma.listing.update({
            where: { id },
            data: { status: "sold" }
        });

        return res.status(200).json({ message: "Listing marked as Sold!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const getRecommendations = async (req, res) => {
    try {
        const { listingId } = req.params;
        const limit = parseInt(req.query.limit) || 2;

        // Fetch all active listings with owner info (same as public feed)
        const allListings = await prisma.listing.findMany({
            where: { status: "active" },
            include: { owner: { select: { id: true, name: true, campus: true, image: true } } },
            orderBy: { createdAt: "desc" },
        });

        if (allListings.length === 0) {
            return res.status(200).json([]);
        }

        // Run TF-IDF cosine similarity engine
        const recommendations = computeRecommendations(listingId, allListings, limit);

        return res.status(200).json(recommendations);
    } catch (error) {
        console.error("Recommendation error:", error);
        return res.status(500).json({ message: error.message });
    }
};