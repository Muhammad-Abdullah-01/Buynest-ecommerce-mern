import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { productValidator } from '../validators/productValidator.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin-only CRUD routes
router.post(
  '/',
  protect,
  admin,
  upload.array('images', 5),
  productValidator,
  createProduct
);

router.put(
  '/:id',
  protect,
  admin,
  upload.array('images', 5),
  productValidator,
  updateProduct
);

router.delete('/:id', protect, admin, deleteProduct);

export default router;
