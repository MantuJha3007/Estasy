"use client";
import { useEffect, useState, use } from 'react';
import { serverFetch } from '@/lib/serverFetch';
import ProductCard from '@/components/product/ProductCard';

export default function ProductListingPage({ params }) {
  const resolvedParams = use(params);
  const category = resolvedParams.category;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await serverFetch(`/products?category=${category}`);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Loading products...</div>;
  }

  // Helper to group products by itemType
  const groupByType = (items) => {
    return items.reduce((acc, item) => {
      const type = item.itemType || 'Other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  };

  // Helper component to render a grouped section
  const RenderGroup = ({ title, items }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-2">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} category={category} />
          ))}
        </div>
      </div>
    );
  };

  const renderClothing = () => {
    const mensProducts = products.filter(p => p.subcategory === 'Men');
    const womensProducts = products.filter(p => p.subcategory === 'Women');
    const mensGrouped = groupByType(mensProducts);
    const womensGrouped = groupByType(womensProducts);

    return (
      <div className="space-y-16">
        {/* Men's Collection */}
        {mensProducts.length > 0 && (
          <section>
            <div className="border-b-2 border-gray-900 pb-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Men's Collection</h2>
            </div>
            {Object.keys(mensGrouped).map(type => (
              <RenderGroup key={type} title={type} items={mensGrouped[type]} />
            ))}
          </section>
        )}

        {/* Women's Collection */}
        {womensProducts.length > 0 && (
          <section>
            <div className="border-b-2 border-gray-900 pb-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Women's Collection</h2>
            </div>
            {Object.keys(womensGrouped).map(type => (
              <RenderGroup key={type} title={type} items={womensGrouped[type]} />
            ))}
          </section>
        )}
      </div>
    );
  };

  const renderGenericGrouped = () => {
    const grouped = groupByType(products);
    return (
      <div className="space-y-12">
        {Object.keys(grouped).map(type => (
          <section key={type}>
            <div className="border-b-2 border-gray-900 pb-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{type}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {grouped[type].map((product) => (
                <ProductCard key={product._id} product={product} category={category} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 capitalize tracking-tight mb-2">
          {category} Collection
        </h1>
        <p className="text-gray-500 text-lg">
          Explore our curated selections.
        </p>
      </div>
      
      {products.length === 0 && (
        <p className="text-gray-500">No products found in this category.</p>
      )}

      {category === 'clothing' ? renderClothing() : renderGenericGrouped()}

    </div>
  );
}
