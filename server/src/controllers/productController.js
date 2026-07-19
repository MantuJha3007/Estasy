const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };

  const products = await Product.find(query);
  res.json(products);
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).limit(4);
  res.json(products);
});

module.exports = { getProducts, getProductBySlug, getFeaturedProducts };
