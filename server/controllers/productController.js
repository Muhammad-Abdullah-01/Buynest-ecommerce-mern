import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ApiError from '../utils/apiError.js';
import cloudinary from '../config/cloudinary.js';

// Helper slug generator
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') + '-' + Date.now();
};

// @desc    Get all products (with search, filter, sort, page)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 8;
    const page = Number(req.query.pageNumber) || 1;

    // Search query
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i'
          }
        }
      : {};

    // Category filter
    let categoryQuery = {};
    if (req.query.category) {
      // Find category by slug
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        categoryQuery = { category: category._id };
      } else {
        // If category slug is invalid, return empty list immediately
        return res.json({ products: [], page: 1, pages: 0, count: 0 });
      }
    }

    // Price range filter
    let priceQuery = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceQuery.price = {};
      if (req.query.minPrice) priceQuery.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceQuery.price.$lte = Number(req.query.maxPrice);
    }

    // In Stock filter
    let stockQuery = {};
    if (req.query.inStock === 'true') {
      stockQuery.stock = { $gt: 0 };
    }

    // Combine all filters
    const query = { ...keyword, ...categoryQuery, ...priceQuery, ...stockQuery };

    // Sorting
    let sortOptions = {};
    if (req.query.sortBy === 'priceAsc') {
      sortOptions = { price: 1 };
    } else if (req.query.sortBy === 'priceDesc') {
      sortOptions = { price: -1 };
    } else if (req.query.sortBy === 'ratings') {
      sortOptions = { ratings: -1 };
    } else {
      sortOptions = { createdAt: -1 }; // default newest
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      'category',
      'name slug'
    );

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const slug = slugify(name);

    // Get files uploaded via multer-storage-cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          url: file.path,
          publicId: file.filename
        });
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      category,
      stock,
      images
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, removeImages } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    // Process image removals if specified (takes array of publicIds to remove)
    if (removeImages) {
      const publicIdsToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      for (const publicId of publicIdsToRemove) {
        try {
          await cloudinary.uploader.destroy(publicId);
          product.images = product.images.filter(img => img.publicId !== publicId);
        } catch (err) {
          console.error(`Error deleting image ${publicId} from Cloudinary:`, err);
        }
      }
    }

    // Process new uploaded images
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        product.images.push({
          url: file.path,
          publicId: file.filename
        });
      });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;

    if (name && name !== product.name) {
      product.slug = slugify(name);
    }

    const updatedProduct = await product.save();
    res.json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (err) {
          console.error(`Failed to delete image ${img.publicId} from Cloudinary:`, err);
        }
      }
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
