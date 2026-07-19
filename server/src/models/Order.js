const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    variantSnapshot: { type: mongoose.Schema.Types.Mixed },
    qty: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentStatus: { type: String, required: true, default: 'pending' }, // pending, paid, failed
  orderStatus: { type: String, required: true, default: 'processing' }, // processing, shipped, delivered, cancelled
  stripePaymentIntentId: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  total: { type: Number, required: true },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
