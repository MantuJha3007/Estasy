const express = require('express');
const router = express.Router();
const { getProductReviews, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:productId').get(getProductReviews).post(protect, addReview);

module.exports = router;
