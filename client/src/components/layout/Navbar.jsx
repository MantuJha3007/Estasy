"use client";
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import MobileMenu from './MobileMenu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 mr-2 md:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 group-hover:scale-105 transition-transform">
                Estasy
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/products/clothing" className="text-gray-600 hover:text-orange-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-orange-600 text-sm font-semibold transition-colors">
                Clothing
              </Link>
              <Link href="/products/watch" className="text-gray-600 hover:text-orange-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-orange-600 text-sm font-semibold transition-colors">
                Watches
              </Link>
              <Link href="/products/shoe" className="text-gray-600 hover:text-orange-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-orange-600 text-sm font-semibold transition-colors">
                Shoes
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>
            
            <Link href={user ? "/account" : "/login"} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all">
              <User size={22} />
            </Link>
            
            <Link href="/cart" className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all relative">
              <ShoppingCart size={22} />
              {mounted && cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch} 
      />
    </nav>
  );
}
