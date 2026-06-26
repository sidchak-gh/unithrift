# UniThrift 🎓🛍️

**UniThrift** is an exclusive, full-stack college marketplace built to help students buy, sell, and trade items safely within their campus community. Whether you're looking for textbooks, electronics, furniture, or dorm essentials, UniThrift provides a seamless and secure platform to connect with peers.

---

## 🚀 Features

- **College-Exclusive Marketplace**: Listings are tailored for students with relevant filters and categories (Electronics, Books, Furniture, etc.).
- **Secure Authentication**: Custom JWT-based authentication with **OTP email verification** — every new account is verified before activation.
- **Gemini AI Moderation**: Listings are automatically reviewed by Google Gemini AI on submission. Clean listings go live instantly; inappropriate ones are rejected with a reason shown to the seller.
- **Robust Listing Management**: Create, edit, and manage your listings with direct image uploads.
- **Admin Dashboard**: Comprehensive admin tools for reviewing, approving, and rejecting listings. Admins can provide a rejection reason that is shown directly to the seller. AI-approved listings are marked with a `✦ AI` badge.
- **Clean UI Aesthetics**: A polished, modern light theme built with TailwindCSS for seamless desktop and mobile use.
- **Wishlist Support**: Save your favorite campus finds and revisit them easily.
- **Real-time Chat**: Message sellers directly via Socket.IO powered chat.
- **Smart Recommendations**: TF-IDF cosine similarity engine for related listing suggestions.

## 🛠️ Tech Stack

**Frontend (Client)**
- React 19 + Vite
- TailwindCSS v4
- Redux Toolkit (State Management)
- React Router DOM v7
- Axios & Lucide React

**Backend (Server)**
- Node.js & Express.js
- PostgreSQL (via Neon Database)
- Prisma ORM
- JWT (JSON Web Tokens) & bcrypt
- Cloudinary & Multer (Image processing)
- Brevo API (OTP email delivery, with console mock fallback)
- Google Gemini AI (`@google/generative-ai`) — listing moderation
- Socket.IO (Real-time chat)

## 📁 Project Structure

This is a standard monorepo containing both the frontend and backend architectures:

```text
unithrift/
├── client/          # React + Vite frontend application
│   ├── src/
│   │   ├── app/     # Redux store configurations
│   │   ├── components/ # Reusable UI pieces & Admin modals
│   │   ├── pages/   # Application routes (Register, Login, MyListings, etc.)
│   │   └── index.css # Tailwind configurations
├── server/          # Node + Express API
│   ├── controllers/ # API logic (auth, listings, admin, chat, ratings)
│   ├── routes/      # Express endpoints
│   ├── middlewares/ # Auth & admin role checks
│   ├── prisma/      # Database schema & migrations
│   ├── utils/       # Mailer, Gemini moderator, recommender
│   └── configs/     # App config (db, multer, cloudinary)
```

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database URL (Local or via Neon)
- Cloudinary credentials for media hosting
- Brevo API Key + Verified Sender Email for OTP delivery (optional; falls back to console logging)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### 1. Repository Setup
```bash
git clone https://github.com/sidchak-gh/unithrift.git
cd unithrift
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install

# Create a .env file with the following keys:
# DATABASE_URL="postgresql://user:password@host/unithrift"
# DIRECT_URL="postgresql://user:password@host/unithrift"
# JWT_SECRET="your_jwt_secret"
# CLOUDINARY_CLOUD_NAME="..."
# CLOUDINARY_API_KEY="..."
# CLOUDINARY_API_SECRET="..."
# ADMIN_EMAIL="admin@yourdomain.com"
# BREVO_API_KEY="your_brevo_api_key"
# BREVO_SENDER_EMAIL="your_verified_sender_email"
# GEMINI_API_KEY="your_gemini_api_key"

# Sync the Prisma database schema
npx prisma db push

# Start the server
npm run server
```

### 3. Frontend Setup (`/client`)
```bash
cd ../client
npm install

# Create a .env file:
# VITE_BACKEND_URL=http://localhost:8000
# VITE_CURRENCY="₹"

# Start the Vite development server
npm run dev
```

Your app will be running at `http://localhost:5173`!

---

## 🔐 How OTP Verification Works

1. User fills in the registration form and submits.
2. Server generates a **6-digit OTP** (valid for 10 minutes).
   - If `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` are configured, the OTP is sent to the user's email via the Brevo SMTP API.
   - If they are NOT configured, the server runs in **Mock Email Mode** and prints the OTP code directly to the backend terminal console for easy local testing.
3. User enters the OTP on the verification screen.
4. On success, the account is created and the user is logged in.

## 🤖 How Gemini AI Moderation Works

1. User submits a new listing
2. Server sends the title, description, category, and images to **Gemini AI**
3. Gemini decides: `approved` → listing goes live instantly | `rejected` → listing is rejected with a reason
4. If Gemini API is unavailable, listing falls back to `pending` for manual admin review
5. In the admin panel, AI-approved listings show a `✦ AI` badge with Gemini's reasoning on hover

---

## 👨‍💻 Contributing & Development

Before making a PR, please ensure you test changes across both the `client` and `server`. If modifying database structures in `server/prisma/schema.prisma`, always run `npx prisma db push` before restarting the server.
