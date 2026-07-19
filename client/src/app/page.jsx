import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { serverFetch } from '@/lib/serverFetch';
import ProductCard from '@/components/product/ProductCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let categoriesData = [];
  try {
    const [clothing, watches, shoes] = await Promise.all([
      serverFetch('/products?category=clothing'),
      serverFetch('/products?category=watch'),
      serverFetch('/products?category=shoe')
    ]);
    
    categoriesData = [
      { title: 'Trending Clothing', path: 'clothing', items: clothing.slice(0, 4) },
      { title: 'Premium Watches', path: 'watch', items: watches.slice(0, 4) },
      { title: 'Comfortable Shoes', path: 'shoe', items: shoes.slice(0, 4) }
    ];
  } catch (error) {
    console.error('Error fetching homepage products:', error);
  }
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-orange-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Style that speaks <span className="text-orange-600">for itself.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover our curated collection of premium clothing, elegant watches, and comfortable shoes designed for the modern lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products/clothing" className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg transition-colors">
                Shop Clothing
              </Link>
              <Link href="/products/watch" className="inline-flex justify-center items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg transition-colors">
                View Watches
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative z-10 hidden md:block">
             <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Fashion collection" className="rounded-2xl shadow-2xl" />
          </div>
        </div>
      </div>

      {/* Dynamic Product Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {categoriesData.map((category) => (
          <div key={category.path} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
              <Link 
                href={`/products/${category.path}`} 
                className="group flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors"
              >
                See All
                <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {category.items?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {category.items.map((product) => (
                  <ProductCard key={product._id} product={product} category={category.path} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No products found for this category.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
