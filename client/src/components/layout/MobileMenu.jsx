"use client";
import Link from 'next/link';
import { X, Search } from 'lucide-react';

export default function MobileMenu({ isOpen, setIsOpen, searchQuery, setSearchQuery, handleSearch }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/20" onClick={() => setIsOpen(false)} />
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl flex flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xl font-bold text-orange-600">Menu</span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={(e) => { setIsOpen(false); handleSearch(e); }} className="relative mb-8">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </form>

        <div className="flex flex-col space-y-4">
          <Link href="/products/clothing" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-900">Clothing</Link>
          <Link href="/products/watch" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-900">Watches</Link>
          <Link href="/products/shoe" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-900">Shoes</Link>
        </div>
      </div>
    </div>
  );
}
