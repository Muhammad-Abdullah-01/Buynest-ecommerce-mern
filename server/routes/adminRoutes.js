import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderToDelivered,
  getAllUsers,
  updateUserRole,
  deleteUser
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect & admin middlewares globally to all admin routes
router.use(protect);
router.use(admin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/deliver', updateOrderToDelivered);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
