import { body } from 'express-validator';
import { validate } from './authValidator.js';

export const orderValidator = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order items must be a non-empty array'),
  body('orderItems.*.product')
    .notEmpty()
    .withMessage('Product ID is required for each item')
    .isMongoId()
    .withMessage('Invalid Product ID format'),
  body('orderItems.*.name')
    .notEmpty()
    .withMessage('Product name is required for each item'),
  body('orderItems.*.qty')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1 for each item'),
  body('orderItems.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number for each item'),
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Shipping address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Shipping city is required'),
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Shipping postal code is required'),
  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Shipping country is required'),
  body('totalPrice')
    .isFloat({ min: 0 })
    .withMessage('Total price must be a positive number'),
  validate
];
