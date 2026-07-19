const asyncHandler = require('../utils/asyncHandler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const options = {
    amount: Math.round(order.total * 100), // Amount in smallest currency unit (paise)
    currency: 'INR', // Change to your base currency if different
    receipt: orderId.toString(),
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Save razorpayOrderId to the DB Order
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json(razorpayOrder);
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Failed to create Razorpay order');
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Payment is authentic
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (order) {
      order.paymentStatus = 'paid';
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();
    }
    
    return res.status(200).json({ message: "Payment verified successfully" });
  } else {
    // Invalid signature
    res.status(400);
    throw new Error("Invalid signature sent!");
  }
});

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
