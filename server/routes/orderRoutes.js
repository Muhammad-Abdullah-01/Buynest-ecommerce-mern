import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  createPaymentIntent
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { orderValidator } from '../validators/orderValidator.js';

const router = express.Router();

router.post('/', protect, orderValidator, createOrder);
router.get('/myorders', protect, getMyOrders);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

export default router;
