const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  order: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

// Auto-calculate avg rating
reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const reviews = await this.model('Review').find({ product: this.product });
  
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount
    : 0;
    
  await Product.findByIdAndUpdate(this.product, {
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount
  });
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
