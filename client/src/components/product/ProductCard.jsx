import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { formatPrice } from '../../utils/formatters.js';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const isProductWishlisted = isInWishlist(product._id);
  const mainImage = product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image';

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <Link to={`/shop/${product.slug}`}>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-slate-400 hover:text-rose-500 transition-colors focus:outline-none"
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-300 ${
              isProductWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''
            }`}
          />
        </button>

        {/* Out of Stock Label */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="space-y-1">
          {/* Category */}
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {product.category?.name || 'Uncategorized'}
          </span>

          {/* Title */}
          <Link to={`/shop/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-slate-800 hover:text-indigo-600 line-clamp-1 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.ratings || 0)
                      ? 'fill-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 font-medium">
              ({product.numReviews || 0})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-base font-extrabold text-slate-900">
            {formatPrice(product.price)}
          </span>

          {product.stock > 0 && (
            <button
              onClick={handleAddToCartClick}
              className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-full transition-all focus:outline-none shadow-sm hover:shadow-indigo-100"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
