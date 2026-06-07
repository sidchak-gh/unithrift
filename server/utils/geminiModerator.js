import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{"approved": true, "reason": "One sentence explanation"}
`;

    const parts = [prompt, ...imageParts];
    const result = await model.generateContent(parts);
    const text = result.response.text().trim();

    // Strip markdown code fences if Gemini wraps the response
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(cleaned);

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
