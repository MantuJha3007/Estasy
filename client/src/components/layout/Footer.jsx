export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-orange-600 mb-4">Estasy</h3>
            <p className="text-sm text-gray-500">Your one-stop shop for premium clothing, watches, and shoes.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="/products/clothing" className="text-sm text-gray-500 hover:text-orange-600">Clothing</a></li>
              <li><a href="/products/watch" className="text-sm text-gray-500 hover:text-orange-600">Watches</a></li>
              <li><a href="/products/shoe" className="text-sm text-gray-500 hover:text-orange-600">Shoes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-orange-600">Contact Us</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-orange-600">FAQ</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-orange-600">Shipping & Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-orange-600">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-orange-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-between">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Estasy, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
