"use client";
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
        <p className="text-gray-500 mb-8">Your cart is currently empty.</p>
        <Link href="/" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {cartItems.map((item) => (
              <li key={`${item.product}-${item.variantId}`} className="py-6 flex">
                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        <span>{item.name}</span>
                      </h3>
                      <p className="ml-4 text-sm font-medium text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.variantSnapshot.size && `Size: ${item.variantSnapshot.size} `}
                      {item.variantSnapshot.color && `Color: ${item.variantSnapshot.color} `}
                      {item.variantSnapshot.strap && `Strap: ${item.variantSnapshot.strap}`}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.product, item.variantId, Math.max(1, item.qty - 1))}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                      >-</button>
                      <span className="px-2 py-1 text-gray-900">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.product, item.variantId, item.qty + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-50"
                      >+</button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product, item.variantId)}
                      className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={clearCart} 
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/checkout')}
              className="mt-6 w-full bg-orange-600 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
