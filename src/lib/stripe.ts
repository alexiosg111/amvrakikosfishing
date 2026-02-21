import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export const CURRENCY = 'eur';

export interface CheckoutSessionParams {
  bookingId: string;
  amount: number;
  email: string;
  tripName: string;
  locale?: string;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession({
  bookingId,
  amount,
  email,
  tripName,
  locale = 'en',
  metadata = {},
}: CheckoutSessionParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: tripName,
            description: `Fishing trip booking #${bookingId}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/${locale}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
    cancel_url: `${baseUrl}/${locale}/payment/cancel?booking_id=${bookingId}`,
    customer_email: email,
    metadata: {
      bookingId,
      locale,
      ...metadata,
    },
    payment_intent_data: {
      metadata: {
        bookingId,
        locale,
        ...metadata,
      },
    },
  });

  return session;
}

export async function createPaymentIntent({
  amount,
  bookingId,
  email,
  metadata = {},
}: {
  amount: number;
  bookingId: string;
  email?: string;
  metadata?: Record<string, string>;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: CURRENCY,
    metadata: {
      bookingId,
      ...metadata,
    },
    receipt_email: email,
  });

  return paymentIntent;
}

export async function retrieveCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent', 'line_items'],
  });
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export async function createRefund({
  paymentIntentId,
  amount,
  reason,
}: {
  paymentIntentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
}) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? amount * 100 : undefined,
    reason,
  });

  return refund;
}

export async function getPaymentMethod(paymentMethodId: string) {
  return await stripe.paymentMethods.retrieve(paymentMethodId);
}

export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

export function formatAmountFromStripe(amount: number): number {
  return Math.round(amount / 100);
}
