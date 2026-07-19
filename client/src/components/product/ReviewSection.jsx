"use client";
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const { user } = useAuthStore();

  const fetchReviews = async () => {
    try {
      const { data } = await apiClient.get(`/reviews/${productId}`);
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkEligibility = async () => {
    if (!user) return;
    try {
      const { data } = await apiClient.get('/orders');
      const hasPurchased = data.some(order => 
        order.deliveryStatus === 'delivered' && 
        order.items.some(item => item.product._id === productId || item.product === productId)
      );
      setCanReview(hasPurchased);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
      checkEligibility();
    }
  }, [productId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canReview) return toast.error("You must purchase and receive this product before reviewing.");
    
    setLoading(true);
    try {
      await apiClient.post('/reviews', { product: productId, rating, comment });
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
      
      {user && canReview && (
        <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Terrible</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea 
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="What did you think about this product?"
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-2 rounded-md font-medium hover:bg-black transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-center mb-2">
                <div className="text-orange-500 font-bold mr-2">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</div>
                <div className="text-sm text-gray-500">by {review.user?.name || 'Anonymous'} on {new Date(review.createdAt).toLocaleDateString()}</div>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
