import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import listingRouter from "./routes/listingRoutes.js";

import adminRouter from "./routes/adminRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import ratingRouter from "./routes/ratingRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));


app.get("/health", (req, res) => {
    res.send("UniThrift API is running...");
});

// Removed Inngest endpoint

app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use("/api/admin", adminRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/rating", ratingRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`UniThrift Server is running on port ${PORT}`);
});