"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage({ params }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await apiClient.get(`/orders/${resolvedParams.orderId}`);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [resolvedParams.orderId]);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!order) return <div className="text-center py-16">Order not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order number is <strong className="break-all">{order._id}</strong>.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left mb-8">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Order Summary</h2>
        <ul className="space-y-4 mb-4">
          {order.items.map((item) => (
            <li key={item._id} className="flex justify-between">
              <span>{item.qty} x {item.product.name}</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="space-x-4">
        <Link href="/account/orders" className="inline-block bg-white text-gray-900 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
          View Orders
        </Link>
        <Link href="/" className="inline-block bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
