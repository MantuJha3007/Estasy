"use client";
import { useEffect, useState, use } from 'react';
import apiClient from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage({ params }) {
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

  if (loading) return <div className="py-8 text-gray-500">Loading order details...</div>;
  if (!order) return <div className="py-8 text-gray-500">Order not found.</div>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <div className="flex items-center mb-6">
        <Link href="/account/orders" className="text-gray-500 hover:text-gray-900 mr-4 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Order ID</h3>
          <p className="text-base font-medium text-gray-900">{order._id}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Date Placed</h3>
          <p className="text-base font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h3>
          <p className="text-base font-medium text-gray-900">${order.total.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Status</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {order.paymentStatus}
          </span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Status</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {order.deliveryStatus}
          </span>
        </div>
      </div>
      
      <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Items</h2>
      <ul className="divide-y divide-gray-200 mb-8">
        {order.items.map((item) => (
          <li key={item._id} className="py-4 flex">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
               {item.product?.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
            </div>
            <div className="ml-4 flex-1 flex flex-col justify-center">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  <Link href={`/products/any/${item.product?.slug || item.product}`}>{item.product?.name || 'Product'}</Link>
                </h4>
                <p className="text-sm font-medium text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500">Qty: {item.qty}</p>
            </div>
          </li>
        ))}
      </ul>
      
      <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Shipping Address</h2>
      <div className="text-sm text-gray-600 space-y-1">
        <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
        <p>{order.shippingAddress.address}</p>
        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
        <p>{order.shippingAddress.country}</p>
      </div>
    </div>
  );
}
