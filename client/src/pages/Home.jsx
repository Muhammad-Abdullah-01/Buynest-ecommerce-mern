import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import { getProducts } from '../services/productService.js';
import { getCategories } from '../services/categoryService.js';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';

const Home = () => {
  // Fetch featured products (latest 4)
  const { data: productData, isLoading: productsLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getProducts({ pageSize: 4, sortBy: 'createdAt' }),
    staleTime: 5 * 60 * 1000
  });

  // Fetch categories
  const { data: categoryData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000
  });

  const featuredProducts = productData?.products || [];
  const categories = categoryData?.categories || [];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl py-20 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)]" />
        
        <div className="max-w-xl space-y-6 z-10 text-center md:text-left">
          <span className="bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Summer Collection 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Define Your <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Own Space.
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-md">
            Discover a curated collection of modern apparel, accessories, and tech items crafted for everyday expression.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              to="/shop"
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-indigo-600/35 hover:shadow-indigo-600/50 transition-all w-full sm:w-auto justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop Collection</span>
            </Link>
            <Link
              to="/shop"
              className="flex items-center space-x-1.5 text-slate-300 hover:text-white font-semibold transition-colors w-full sm:w-auto justify-center"
            >
              <span>Explore Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hero Image Mock */}
        <div className="relative w-full max-w-sm mt-12 md:mt-0 aspect-square rounded-2xl bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 border border-slate-800 p-8 flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[7rem] font-black text-white select-none">BuyNest</span>
          </div>
          <div className="text-center space-y-4 z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl max-w-xs">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Must Have Item</span>
              <h3 className="text-white font-bold text-lg mt-1">Premium Canvas Backpack</h3>
              <p className="text-slate-400 text-xs mt-1">$120.00</p>
              <div className="flex text-amber-400 justify-center mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Free Shipping</h4>
            <p className="text-xs text-slate-500">On all orders over $100</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Secure Payment</h4>
            <p className="text-xs text-slate-500">100% secure Stripe checkout</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Easy Returns</h4>
            <p className="text-xs text-slate-500">30-day money-back guarantee</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Premium Quality</h4>
            <p className="text-xs text-slate-500">Curated boutique products</p>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-sm text-slate-500">Explore collections curated for your lifestyle.</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            View All
          </Link>
        </div>

        {categoriesLoading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No categories found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${category.slug}`}
                className="group relative bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col justify-center min-h-[140px]"
              >
                <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">New Arrivals</h2>
            <p className="text-sm text-slate-500">Check out the latest fresh additions to our boutique.</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            View All
          </Link>
        </div>

        {productsLoading ? (
          <Loader />
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No products found. Add products in admin panel.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
