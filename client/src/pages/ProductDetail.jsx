import React, { useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingCart, Star, ArrowLeft, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { getProductBySlug } from '../services/productService.js';
import { useCart } from '../hooks/useCart.js';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import Loader from '../components/common/Loader.jsx';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product detail
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    retry: false
  });

  const product = data?.product;

  if (isLoading) {
    return <Loader fullPage={true} />;
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
        <p className="text-slate-500">The product you are looking for might have been removed or renamed.</p>
        <Link
          to="/shop"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const isProductWishlisted = isInWishlist(product._id);
  const images = product.images || [];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back Link */}
      <Link
        to="/shop"
        className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm">
        {/* Left Side: Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
            <img
              src={images[selectedImage]?.url || 'https://via.placeholder.com/600x600?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover object-center animate-in fade-in duration-300"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.publicId}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-50 transition-all ${
                    selectedImage === idx ? 'border-indigo-600 scale-95' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category?.name || 'Collection'}
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center space-x-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.ratings || 0)
                        ? 'fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-500">
                {product.ratings?.toFixed(1) || '0.0'} ({product.numReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-black text-slate-950">
              {formatPrice(product.price)}
            </div>

            <hr className="border-slate-100" />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Details</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-100">
            {/* Stock status & Qty Selection */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Availability</span>
              {product.stock > 0 ? (
                <div className="flex items-center space-x-1.5 text-emerald-600 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>In Stock ({product.stock} items available)</span>
                </div>
              ) : (
                <span className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Out of Stock
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(quantity - 1)}
                    className="px-3.5 py-1.5 hover:bg-slate-50 font-bold disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-5 py-1.5 text-sm font-semibold text-slate-800">{quantity}</span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 hover:bg-slate-50 font-bold disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Buttons: Add to Cart & Wishlist */}
            <div className="flex gap-4">
              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-grow flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-full shadow-lg shadow-indigo-200 transition-all focus:outline-none"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Shopping Cart</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex-grow bg-slate-100 text-slate-400 font-bold py-4 rounded-full cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}

              <button
                onClick={handleWishlistClick}
                className={`p-4 border rounded-full transition-all focus:outline-none ${
                  isProductWishlisted
                    ? 'border-rose-100 bg-rose-50 text-rose-500 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isProductWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
        <div className="space-y-1">
          <Shield className="w-5 h-5 text-indigo-600 mx-auto" />
          <h4 className="font-semibold text-slate-800 text-sm">Genuine Guarantee</h4>
          <p className="text-xs text-slate-500">100% original product sourced directly</p>
        </div>
        <div className="space-y-1">
          <Sparkles className="w-5 h-5 text-indigo-600 mx-auto" />
          <h4 className="font-semibold text-slate-800 text-sm">Quality Checked</h4>
          <p className="text-xs text-slate-500">Inspected by hand before dispatching</p>
        </div>
        <div className="space-y-1">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 mx-auto" />
          <h4 className="font-semibold text-slate-800 text-sm">Easy Returns</h4>
          <p className="text-xs text-slate-500">Return items for store credits or cash back</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
