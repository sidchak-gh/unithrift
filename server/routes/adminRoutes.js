import express from 'express';
import { protect, verifyAdminRole } from '../middlewares/authMiddleware.js';
import { changeStatus, dashboard, getAllListings, getPendingListings, isAdmin } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/isAdmin', protect, verifyAdminRole, isAdmin);
adminRouter.get('/dashboard', protect, verifyAdminRole, dashboard);
adminRouter.get('/all-listings', protect, verifyAdminRole, getAllListings);
adminRouter.get('/pending-listings', protect, verifyAdminRole, getPendingListings);
adminRouter.put('/change-status/:listingId', protect, verifyAdminRole, changeStatus);

export default adminRouter;