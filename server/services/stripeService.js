import Stripe from 'stripe';

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export const createPaymentIntent = async (amount, currency = 'usd') => {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.');
  }

  // Stripe expects amount in cents
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: { integration_check: 'accept_a_payment' }
  });

  return paymentIntent;
};
