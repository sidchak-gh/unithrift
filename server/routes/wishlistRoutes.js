import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getMyWishlist, toggleWishlist } from '../controllers/wishlistController.js';

const wishlistRouter = express.Router();

wishlistRouter.post('/toggle', protect, toggleWishlist);
wishlistRouter.get('/', protect, getMyWishlist);

export default wishlistRouter;
