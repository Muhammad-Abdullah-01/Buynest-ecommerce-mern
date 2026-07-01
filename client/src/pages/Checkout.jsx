import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../hooks/useCart.js';
import CheckoutForm from './CheckoutForm.jsx';
import Loader from '../components/common/Loader.jsx';

// Initialize stripe with test mode public key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
    'pk_test_51I1234567890abcdefghijklmnopqrstuvwxyz'
);

const Checkout = () => {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black">Your Cart is Empty</h2>
        <p className="text-slate-500 mt-2">Cannot proceed to checkout with an empty cart.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">Complete your purchase securely.</p>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Checkout;
