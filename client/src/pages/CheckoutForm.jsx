import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import { addressSchema } from '../validations/schemas.js';
import { formatPrice } from '../utils/formatters.js';
import * as orderService from '../services/orderService.js';
import Loader from '../components/common/Loader.jsx';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cartItems, prices, clearCart, shippingAddress, saveShippingAddress } = useCart();

  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: shippingAddress
  });

  const handleAddressSubmit = (data) => {
    saveShippingAddress(data);
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Create order in DB (unpaid status)
      const orderData = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod: 'Stripe',
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice
      };

      const orderRes = await orderService.createOrder(orderData);
      if (!orderRes?.success || !orderRes?.order) {
        throw new Error('Order creation failed on server');
      }
      const orderId = orderRes.order._id;

      // 2. Request Stripe Client Secret
      const paymentRes = await orderService.createPaymentIntent(prices.totalPrice);
      if (!paymentRes?.success || !paymentRes?.clientSecret) {
        throw new Error('Failed to retrieve payment intent secret');
      }
      const clientSecret = paymentRes.clientSecret;

      // 3. Confirm Stripe card payment
      const cardElement = elements.getElement(CardElement);
      const stripeResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userBillingNameHelper(shippingAddress),
            address: {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              postal_code: shippingAddress.postalCode,
              country: 'US' // Stripe expects ISO code, let's hardcode or default US for testing
            }
          }
        }
      });

      if (stripeResult.error) {
        throw new Error(stripeResult.error.message);
      }

      // 4. Update order to Paid in DB
      if (stripeResult.paymentIntent.status === 'succeeded') {
        const paymentResult = {
          id: stripeResult.paymentIntent.id,
          status: stripeResult.paymentIntent.status,
          email_address: stripeResult.paymentIntent.receipt_email || 'paid@stripe.com'
        };

        await orderService.updateOrderToPaid(orderId, paymentResult);

        // 5. Success cleanup and routing
        clearCart();
        navigate(`/orders/success?id=${orderId}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Payment execution failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const userBillingNameHelper = (addressObj) => {
    return `Client Billing Name`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Forms Section */}
      <div className="lg:col-span-2 space-y-6">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm p-4 rounded-2xl flex items-center space-x-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Tabs Indicators */}
        <div className="flex border-b border-slate-200">
          <div
            className={`flex-1 text-center py-3 font-semibold text-sm border-b-2 transition-all ${
              step === 1 ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
            }`}
          >
            1. Shipping Information
          </div>
          <div
            className={`flex-1 text-center py-3 font-semibold text-sm border-b-2 transition-all ${
              step === 2 ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
            }`}
          >
            2. Payment Details
          </div>
        </div>

        {/* Step 1: Address Form */}
        {step === 1 && (
          <form
            onSubmit={handleSubmit(handleAddressSubmit)}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center space-x-2 text-slate-800 mb-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-lg">Shipping Address</h2>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Address Line</label>
              <input
                type="text"
                placeholder="123 Fashion Blvd, Apt 4B"
                {...register('address')}
                className={`w-full bg-slate-50 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all ${
                  errors.address ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.address && <p className="text-xs text-rose-500 font-semibold">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">City</label>
                <input
                  type="text"
                  placeholder="New York"
                  {...register('city')}
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all ${
                    errors.city ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.city && <p className="text-xs text-rose-500 font-semibold">{errors.city.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Postal Code</label>
                <input
                  type="text"
                  placeholder="10001"
                  {...register('postalCode')}
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all ${
                    errors.postalCode ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.postalCode && <p className="text-xs text-rose-500 font-semibold">{errors.postalCode.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Country</label>
                <input
                  type="text"
                  placeholder="United States"
                  {...register('country')}
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all ${
                    errors.country ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.country && <p className="text-xs text-rose-500 font-semibold">{errors.country.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-full shadow-lg shadow-indigo-100 transition-all mt-4"
            >
              Continue to Payment
            </button>
          </form>
        )}

        {/* Step 2: Stripe Payment Form */}
        {step === 2 && (
          <form
            onSubmit={handlePaymentSubmit}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div className="flex items-center space-x-2 text-slate-800">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-lg">Secure Credit Card Payment</h2>
            </div>

            {/* Address Summary Preview */}
            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 space-y-1 relative">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="absolute top-4 right-4 text-indigo-600 font-bold hover:underline"
              >
                Edit Address
              </button>
              <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-1">Shipping To</h4>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>

            {/* Stripe Card Element */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Card Details</label>
              <div className="border border-slate-200 bg-slate-50 rounded-xl p-4">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#1e293b',
                        '::placeholder': {
                          color: '#94a3b8'
                        }
                      },
                      invalid: {
                        color: '#ef4444'
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3.5 rounded-full transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing || !stripe}
                className="w-2/3 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-full shadow-lg shadow-indigo-100 disabled:opacity-40 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isProcessing ? 'Processing Payment...' : `Pay ${formatPrice(prices.totalPrice)}`}</span>
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400">
              Payments are secured via Stripe SSL. Card information is never saved on our servers.
            </p>
          </form>
        )}
      </div>

      {/* Cart Summary Panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 self-start">
        <div className="flex items-center space-x-2 text-slate-800">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-lg">Order Items</h2>
        </div>

        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div key={item.product} className="flex justify-between items-center py-3 text-sm">
              <div className="flex items-center space-x-3 truncate">
                <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400">Qty: {item.qty}</p>
                </div>
              </div>
              <span className="font-bold text-slate-800 ml-4">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Items Subtotal</span>
            <span className="font-semibold text-slate-700">{formatPrice(prices.itemsPrice)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Shipping Cost</span>
            <span className="font-semibold text-slate-700">{prices.shippingPrice === 0 ? 'Free' : formatPrice(prices.shippingPrice)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Estimated Sales Tax</span>
            <span className="font-semibold text-slate-700">{formatPrice(prices.taxPrice)}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2">
            <span>Total Amount</span>
            <span>{formatPrice(prices.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
