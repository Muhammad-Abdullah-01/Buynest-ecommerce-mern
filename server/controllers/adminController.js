import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ApiError from '../utils/apiError.js';

// @desc    Get dashboard statistics (revenue, orders count, users count, products count)
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Calculate total revenue from paid orders
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Get recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Sales by category chart helper data
    const ordersByCategory = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetail'
        }
      },
      { $unwind: '$productDetail' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productDetail.category',
          foreignField: '_id',
          as: 'categoryDetail'
        }
      },
      { $unwind: '$categoryDetail' },
      {
        $group: {
          _id: '$categoryDetail.name',
          sales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      },
      recentOrders,
      ordersByCategory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/admin/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order marked as delivered',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details/role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    // Do not allow self role change if there is only 1 admin
    if (user._id.toString() === req.user._id.toString() && req.body.role === 'user') {
      return next(new ApiError(400, 'Cannot revoke your own admin rights'));
    }

    user.role = req.body.role || user.role;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    if (user._id.toString() === req.user._id.toString()) {
      return next(new ApiError(400, 'Cannot delete your own admin account'));
    }

    await User.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
