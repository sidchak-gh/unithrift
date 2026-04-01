# UniThrift 🎓🛍️

**UniThrift** is an exclusive, full-stack college marketplace built to help students buy, sell, and trade items safely within their campus community. Whether you're looking for textbooks, electronics, furniture, or dorm essentials, UniThrift provides a seamless and secure platform to connect with peers.

---

## 🚀 Features

- **College-Exclusive Marketplace**:  Listings are tailored for students with relevant filters and categories (Electronics, Books, Furniture, etc.).
- **Secure Authentication**: Custom JWT-based authentication system ensuring platform security.
- **Robust Listing Management**: Create, edit, and manage your listings with direct image uploads.
- **Admin Dashboard**: Comprehensive admin tools for reviewing, approving, and rejecting pending listings to maintain quality and safety.
- **Clean UI Aesthetics**: A polished, modern light theme built with TailwindCSS for seamless desktop and mobile use.
- **Wishlist Support**: Save your favorite campus finds and revisit them easily.

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

## 📁 Project Structure

This is a standard monorepo containing both the frontend and backend architectures:

```text
unithrift/
├── client/          # React + Vite frontend application
│   ├── src/
│   │   ├── app/     # Redux store configurations
│   │   ├── components/ # Reusable UI pieces & Admin modals
│   │   ├── pages/   # Application routes
│   │   └── index.css # Tailwind configurations
├── server/          # Node + Express API
│   ├── controllers/ # API logic
│   ├── routes/      # Express endpoints
│   ├── middlewares/ # Auth & validation checks
│   ├── prisma/      # Database schema & migrations
│   └── configs/     # App config (db, multer, cloudinary)
```

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database URL (Local or via Neon)
- Cloudinary credentials for media hosting

### 1. Repository Setup
```bash
git clone https://github.com/sidchak-gh/unithrift.git
cd unithrift
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install

# Create a .env file locally with the following keys:
# PORT=8000
# DATABASE_URL="postgresql://user:password@localhost/unithrift?schema=public"
# JWT_SECRET="your_jwt_secret"
# CLOUDINARY_CLOUD_NAME="..."
# CLOUDINARY_API_KEY="..."
# CLOUDINARY_API_SECRET="..."

# Sync the Prisma database schema
npx prisma db push

# Start the Node/Express server via nodemon
npm run server
```

### 3. Frontend Setup (`/client`)
```bash
cd ../client
npm install

# Create a .env file locally:
# VITE_BACKEND_URL=http://localhost:8000
# VITE_CURRENCY="₹" (or your local currency)

# Start the Vite development server
npm run dev
```

Your app will be running actively at `http://localhost:5173`!

---

## 👨‍💻 Contributing & Development

Before making a PR, please ensure you test changes across both the `client` and `server`. If modifying database structures in `server/prisma/schema.prisma`, always run `npx prisma db push` (for local development) before restarting the server wrapper. 
