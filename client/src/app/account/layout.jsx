"use client";
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AccountLayout({ children }) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted || !user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">My Account</h2>
          <nav className="space-y-2">
            <Link 
              href="/account" 
              className={`block px-4 py-2 rounded-md ${pathname === '/account' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Profile
            </Link>
            <Link 
              href="/account/orders" 
              className={`block px-4 py-2 rounded-md ${pathname.includes('/account/orders') ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Order History
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md mt-4 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
      <div className="md:w-3/4">
        {children}
      </div>
    </div>
  );
}
