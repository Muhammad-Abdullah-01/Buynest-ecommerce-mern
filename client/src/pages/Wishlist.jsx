import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { useCart } from '../hooks/useCart.js';
import { formatPrice } from '../utils/formatters.js';
import Loader from '../components/common/Loader.jsx';

const Wishlist = () => {
  const { wishlist, isLoading, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (isLoading) {
    return <Loader fullPage={true} />;
  }

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-slate-50 text-rose-300 rounded-full flex items-center justify-center mx-auto border border-slate-100 animate-pulse">
            <Heart className="w-8 h-8 fill-rose-100 text-rose-300" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Your Wishlist is Empty</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Save items you love here to easily purchase them later or monitor price drops.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-full shadow-md"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => {
            const image = product.images?.[0]?.url || 'https://via.placeholder.com/150';
            return (
              <div
                key={product._id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                {/* Image and Header */}
                <div className="relative aspect-video w-full bg-slate-50 overflow-hidden">
                  <img src={image} alt={product.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-3 right-3 p-2 bg-white/95 rounded-full shadow-sm text-rose-500 hover:bg-rose-50 transition-all"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {product.category?.name || 'Category'}
                    </span>
                    <Link
                      to={`/shop/${product.slug}`}
                      className="block font-bold text-slate-800 hover:text-indigo-600 line-clamp-1 text-sm md:text-base"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-extrabold text-slate-900">
                      {formatPrice(product.price)}
                    </span>

                    {product.stock > 0 ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.8 rounded-full shadow-md shadow-indigo-100 transition-all"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
