import express from 'express';
import { addListing, deleteUserListing, getAllPublicListing, getAllUserListing, updateListing, markSold } from '../controllers/listingController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const listingRouter = express.Router();

listingRouter.post('/', upload.array("images", 5), protect, addListing);
listingRouter.put('/', upload.array("images", 5), protect, updateListing);
listingRouter.get('/public', getAllPublicListing);
listingRouter.get('/user', protect, getAllUserListing);
listingRouter.delete('/:listingId', protect, deleteUserListing);
listingRouter.put('/mark-sold/:id', protect, markSold);

export default listingRouter;