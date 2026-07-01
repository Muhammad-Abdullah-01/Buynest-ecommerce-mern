import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, LogOut, ChevronDown, LayoutDashboard, UserCheck, PackageOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useCart } from '../../hooks/useCart.js';
import { WishlistContext } from '../../context/WishlistContext.jsx';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useContext(WishlistContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                BuyNest.
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link
              to="/"
              className={`${
                location.pathname === '/'
                  ? 'text-indigo-600'
                  : 'text-slate-600 hover:text-indigo-600'
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`${
                location.pathname.startsWith('/shop')
                  ? 'text-indigo-600'
                  : 'text-slate-600 hover:text-indigo-600'
              } transition-colors`}
            >
              Shop
            </Link>
          </nav>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Icons & Account - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/wishlist"
              className="relative text-slate-600 hover:text-indigo-600 transition-colors p-1"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative text-slate-600 hover:text-indigo-600 transition-colors p-1"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1.5 text-slate-700 hover:text-indigo-600 focus:outline-none py-1 text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <UserCheck className="w-4 h-4 text-slate-500" />
                        <span>Profile Settings</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <PackageOpen className="w-4 h-4 text-slate-500" />
                        <span>My Orders</span>
                      </Link>
                      <hr className="border-slate-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50/50 text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.8 rounded-full shadow-sm shadow-indigo-200 hover:shadow-indigo-300 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger button - Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative text-slate-600 hover:text-indigo-600 transition-colors p-1"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-indigo-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 space-y-3">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          <div className="flex flex-col space-y-2.5 pt-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 py-1"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 py-1"
            >
              Shop
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 py-1"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>

            <hr className="border-slate-100 my-1" />

            {isAuthenticated ? (
              <>
                <div className="text-xs font-bold text-slate-400 px-1 uppercase tracking-wider">
                  Account: {user?.name}
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-indigo-600 py-1"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-indigo-600 py-1"
                >
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-indigo-600 py-1"
                >
                  <PackageOpen className="w-4 h-4 text-slate-500" />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-sm font-semibold text-rose-600 py-1 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 py-2 border border-slate-200 rounded-full text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full text-center shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
