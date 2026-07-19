const asyncHandler = require('../utils/asyncHandler');
const Review = require('../models/Review');
const Order = require('../models/Order');

const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
});

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;
  
  const order = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    paymentStatus: 'paid'
  });

  if (!order) {
    res.status(400);
    throw new Error('You must purchase this product before reviewing');
  }

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = new Review({
    rating: Number(rating),
    comment,
    product: productId,
    user: req.user._id,
    order: order._id,
  });

  await review.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = { getProductReviews, addReview };
