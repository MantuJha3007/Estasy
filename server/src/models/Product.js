const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  stock: { type: Number, required: true, default: 0 },
}, { discriminatorKey: 'kind', _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['clothing', 'watch', 'shoe'] 
  },
  subcategory: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Unisex'],
    default: 'Unisex'
  },
  itemType: {
    type: String,
    required: true,
    default: 'General'
  },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  images: [{ type: String }],
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  variants: [variantSchema]
}, { timestamps: true });

// Discriminators for variants
productSchema.path('variants').discriminator('ClothingVariant', new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true }
}, { _id: false }));

productSchema.path('variants').discriminator('WatchVariant', new mongoose.Schema({
  color: { type: String, required: true },
  strap: { type: String, required: true }
}, { _id: false }));

productSchema.path('variants').discriminator('ShoeVariant', new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true }
}, { _id: false }));

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
