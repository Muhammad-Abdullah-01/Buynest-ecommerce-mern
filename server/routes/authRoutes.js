import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUserWishlist,
  toggleWishlistItem
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator
} from '../validators/authValidator.js';

const router = express.Router();

// Public auth routes
router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidator, resetPassword);

// Protected user routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfileValidator, updateUserProfile);
router.get('/wishlist', protect, getUserWishlist);
router.post('/wishlist', protect, toggleWishlistItem);

export default router;
