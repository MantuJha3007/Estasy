"use client";
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const [address, setAddress] = useState({
    fullName: '', address: '', city: '', postalCode: '', country: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mounted && cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router, mounted]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to continue checkout');
      router.push('/login?redirect=/checkout');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order in DB
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product,
          variantId: item.variantId,
          variantSnapshot: item.variantSnapshot,
          qty: item.qty,
          price: item.price
        })),
        shippingAddress: address,
        total: getCartTotal()
      };

      const { data: dbOrder } = await apiClient.post('/orders', orderData);
      
      // 2. Create Razorpay Order
      const { data: rzpOrder } = await apiClient.post('/payment/create-order', {
        orderId: dbOrder._id
      });
      
      // 3. Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Estasy",
        description: "Order Payment",
        order_id: rzpOrder.id,
        handler: async function (response) {
          try {
            // 4. Verify Payment on success
            await apiClient.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful!');
            clearCart();
            router.push(`/order-success/${dbOrder._id}`);
          } catch (verifyError) {
            toast.error(verifyError.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email || '',
        },
        theme: {
          color: "#ea580c" // Tailwind orange-600
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
      
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to initialize checkout');
    }
  };

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  if (!mounted || cartItems.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
      
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required name="fullName" value={address.fullName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input required name="address" value={address.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input required name="city" value={address.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input required name="postalCode" value={address.postalCode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input required name="country" value={address.country} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-black transition-colors mt-6 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
