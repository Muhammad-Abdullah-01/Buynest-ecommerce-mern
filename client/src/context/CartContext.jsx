import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const savedAddress = localStorage.getItem('shippingAddress');
    return savedAddress ? JSON.parse(savedAddress) : { address: '', city: '', postalCode: '', country: '' };
  });

  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);

      if (existItem) {
        // Limit to stock quantity if the updated qty exceeds it
        const newQty = Math.min(product.stock, existItem.qty + qty);
        return prevItems.map((x) =>
          x.product === product._id ? { ...x, qty: newQty } : x
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.images?.[0]?.url || 'https://via.placeholder.com/150',
            price: product.price,
            stock: product.stock,
            qty: Math.min(product.stock, qty)
          }
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
  };

  const updateQty = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) => (x.product === id ? { ...x, qty: Number(qty) } : x))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const saveShippingAddress = (addressData) => {
    setShippingAddress(addressData);
  };

  // Prices calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10; // Free shipping over $100
  const taxPrice = Math.round(itemsPrice * 0.15 * 100) / 100; // 15% GST/tax
  const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        setPaymentMethod,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        saveShippingAddress,
        prices: {
          itemsPrice: Math.round(itemsPrice * 100) / 100,
          shippingPrice,
          taxPrice,
          totalPrice
        }
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
