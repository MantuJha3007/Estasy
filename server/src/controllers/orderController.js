const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/Order');

const addOrderItems = asyncHandler(async (req, res) => {
  const { items, shippingAddress, total } = req.body;

  if (items && items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      total,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product');

  if (order && order.user._id.toString() === req.user._id.toString()) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

module.exports = { addOrderItems, getOrderById, getMyOrders };
