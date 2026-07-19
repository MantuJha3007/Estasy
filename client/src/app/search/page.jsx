"use client";
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { serverFetch } from '@/lib/serverFetch';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await serverFetch(`/products?search=${encodeURIComponent(query)}`);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Search Results for "{query}"
      </h1>
      
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading results...</div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">No products found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link key={product._id} href={`/products/${product.category}/${product.slug}`} className="group block">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square mb-4 relative">
                {product.images?.[0] && (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                {product.name}
              </h3>
              <p className="text-gray-500 font-medium">${product.basePrice.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
