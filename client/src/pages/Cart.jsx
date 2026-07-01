import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import { formatPrice } from '../utils/formatters.js';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, prices } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto border border-slate-100">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Head to the store to explore our latest items.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-full shadow-md"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Product details */}
              <div className="flex-grow min-w-0 space-y-1">
                <Link
                  to={`/shop/product-slug`} // Slugs could be queried or we default to direct navigation if details page matches id too, but let's keep name clean
                  className="font-bold text-slate-800 hover:text-indigo-600 text-sm md:text-base truncate block"
                >
                  {item.name}
                </Link>
                <div className="text-sm font-extrabold text-indigo-600">
                  {formatPrice(item.price)}
                </div>
              </div>

              {/* Quantity Selectors */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                <button
                  disabled={item.qty <= 1}
                  onClick={() => updateQty(item.product, item.qty - 1)}
                  className="px-2.5 py-1 hover:bg-slate-50 font-bold disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 py-1 text-sm font-semibold text-slate-800">{item.qty}</span>
                <button
                  disabled={item.qty >= item.stock}
                  onClick={() => updateQty(item.product, item.qty + 1)}
                  className="px-2.5 py-1 hover:bg-slate-50 font-bold disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.product)}
                className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">{formatPrice(prices.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span className="font-semibold text-slate-800">
                {prices.shippingPrice === 0 ? 'Free' : formatPrice(prices.shippingPrice)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Estimated Tax</span>
              <span className="font-semibold text-slate-800">{formatPrice(prices.taxPrice)}</span>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between text-base font-extrabold text-slate-900">
              <span>Total Price</span>
              <span>{formatPrice(prices.totalPrice)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-full shadow-lg shadow-indigo-200 transition-all focus:outline-none"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-[10px] text-slate-400">
            Free Shipping on orders above $100. Taxes are computed based on location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
