"use client";
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import Link from 'next/link';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="py-8 text-gray-500">Loading orders...</div>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="py-3 font-medium">Order ID</th>
                <th className="py-3 font-medium">Date</th>
                <th className="py-3 font-medium">Total</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-4 font-medium text-sm text-gray-900">{order._id.substring(0, 8)}...</td>
                  <td className="py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 text-sm text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-right">
                    <Link href={`/account/orders/${order._id}`} className="text-orange-600 hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
