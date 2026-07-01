import Category from '../models/Category.js';
import ApiError from '../utils/apiError.js';

// Helper slug generator
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return next(new ApiError(400, 'Category name is required'));
    }

    const slug = slugify(name);
    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return next(new ApiError(400, 'Category already exists'));
    }

    const category = await Category.create({
      name,
      slug,
      description
    });

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    
    if (name) {
      category.slug = slugify(name);
    }

    const updatedCategory = await category.save();
    res.json({
      success: true,
      category: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
