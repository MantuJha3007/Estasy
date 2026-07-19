"use client";
import { useEffect, useState, use } from 'react';
import { serverFetch } from '@/lib/serverFetch';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import ReviewSection from '@/components/product/ReviewSection';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const { category, slug } = resolvedParams;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await serverFetch(`/products/${slug}`);
        setProduct(data);
        if (data.variants?.length > 0) {
          setSelectedVariantId(data.variants[0]._id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading product...</div>;
  if (!product) return <div className="text-center py-16 text-gray-500">Product not found</div>;

  const selectedVariant = product.variants?.find(v => v._id === selectedVariantId);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addToCart({
      product: product._id,
      name: product.name,
      price: product.basePrice,
      image: product.images?.[0],
      variantId: selectedVariant._id,
      variantSnapshot: selectedVariant,
      qty: quantity
    });
    
    toast.success('Added to cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Images */}
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
             {product.images?.[0] ? (
               <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
             )}
          </div>
        </div>
        
        {/* Info */}
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-medium text-orange-600 mb-6">${product.basePrice.toFixed(2)}</p>
          
          <p className="text-gray-600 mb-8">{product.description}</p>
          
          {/* Variant Selector */}
          {product.variants?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Options</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariantId(v._id)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedVariantId === v._id 
                        ? 'border-orange-600 text-orange-600 bg-orange-50' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {v.size && `Size: ${v.size} `}
                    {v.color && `Color: ${v.color} `}
                    {v.strap && `Strap: ${v.strap}`}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                disabled={quantity <= 1}
              >-</button>
              <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                disabled={quantity >= (selectedVariant?.stock || 1)}
              >+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="flex-1 bg-orange-600 text-white px-8 py-3 rounded-md font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-400"
            >
              {!selectedVariant ? 'Select Option' : selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
          
          {selectedVariant && (
             <p className="text-sm text-gray-500">
               {selectedVariant.stock} items available in stock
             </p>
          )}
        </div>
      </div>
      
      <ReviewSection productId={product._id} />
    </div>
  );
}
