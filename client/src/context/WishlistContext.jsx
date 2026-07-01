import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';
import * as authService from '../services/authService.js';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await authService.getWishlist();
      if (data?.success) {
        setWishlist(data.wishlist || []);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      // Redirect or show alert (handled in UI, but safe check here)
      return { success: false, message: 'Please log in to manage your wishlist' };
    }
    try {
      const data = await authService.toggleWishlist(productId);
      if (data?.success) {
        // Fetch full populated wishlist again
        await fetchWishlist();
        return { success: true, message: data.message };
      }
      return { success: false, message: 'Failed to update wishlist' };
    } catch (err) {
      console.error('Wishlist toggle error', err);
      return { success: false, message: err.response?.data?.message || 'Error occurred' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        toggleWishlist,
        isInWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
