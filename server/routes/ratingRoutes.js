import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { addRating, getSellerRatings } from '../controllers/ratingController.js';

const ratingRouter = express.Router();

ratingRouter.post('/', protect, addRating);
ratingRouter.get('/:sellerId', getSellerRatings); // Public endpoint so anyone can see a seller's rating

export default ratingRouter;
