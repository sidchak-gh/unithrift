import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../configs/prisma.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Checks if the monthly AI moderation usage has exceeded the configured limit (default: 50).
 */
export const hasExceededMonthlyLimit = async () => {
  const limit = parseInt(process.env.GEMINI_MONTHLY_LIMIT || "50", 10);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Count listings created/reviewed by AI this month
  const count = await prisma.listing.count({
    where: {
      aiApproved: { not: null },
      updatedAt: { gte: startOfMonth },
    },
  });

  return count >= limit;
};

/**
 * Fetches an image from a URL and returns it as a Gemini-compatible inline part.
 */
const urlToGenerativePart = async (url) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = response.headers.get("content-type") || "image/jpeg";
    return { inlineData: { data: base64, mimeType } };
  } catch {
    return null; // skip image if fetch fails
  }
};

/**
 * Moderates a listing using Gemini AI.
 *
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.category
 * @param {string[]} params.imageUrls
 * @returns {Promise<{ approved: boolean, reason: string }>}
 */
export const moderateListing = async ({ title, description, category, imageUrls = [] }) => {
  try {
    // Check if we hit the monthly 50 reviews limit
    const limitReached = await hasExceededMonthlyLimit();
    if (limitReached) {
      console.warn("⚠️ [GEMINI] Monthly AI moderation quota (50/month) reached. Listing queued for manual admin review.");
      return null; // Signals controller to set status = 'pending'
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            approved: { type: "BOOLEAN" },
            reason: { type: "STRING" }
          },
          required: ["approved", "reason"]
        }
      }
    });

    // Fetch up to 3 images as inline data (Gemini multimodal)
    const imageParts = (
      await Promise.all(imageUrls.slice(0, 3).map(urlToGenerativePart))
    ).filter(Boolean);

    const prompt = `
You are a content moderator for UniThrift, a campus marketplace where university students buy and sell second-hand items.

Analyze the following listing and decide if it should be approved or rejected.

LISTING DETAILS:
- Title: ${title}
- Description: ${description || "No description provided"}
- Category: ${category}

APPROVAL RULES:
✅ Approve if: It is a legitimate second-hand item (books, electronics, furniture, clothing, appliances, vehicles, sports gear, etc.) that a student might sell.
❌ Reject if: It contains adult/explicit content, promotes illegal items (drugs, weapons, stolen goods), is a scam, spam, has offensive/hateful content, or is completely irrelevant to a campus marketplace.
⚠️ When in doubt, approve — lean towards approval for borderline cases.
`;

    const parts = [prompt, ...imageParts];
    const result = await model.generateContent(parts);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);

    return {
      approved: Boolean(parsed.approved),
      reason: parsed.reason || "Reviewed by Gemini AI",
    };
  } catch (error) {
    console.error("Gemini moderation error:", error.message);
    // Fallback: return null to signal the caller to use "pending"
    return null;
  }
};
