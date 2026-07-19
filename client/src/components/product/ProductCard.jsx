import Link from 'next/link';

export default function ProductCard({ product, category }) {
  // Use product.category if category prop is not provided
  const cat = category || product.category;

  return (
    <Link href={`/products/${cat}/${product.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      <div className="bg-gray-50 aspect-square relative overflow-hidden">
        {product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate mb-1">
          {product.name}
        </h3>
        <p className="text-orange-600 font-bold text-lg">${product.basePrice.toFixed(2)}</p>
      </div>
    </Link>
  );
}
