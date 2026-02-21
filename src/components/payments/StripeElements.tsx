'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ReactNode } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeElementsProviderProps {
  clientSecret: string;
  children: ReactNode;
  locale?: string;
}

const appearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#1e3a5f',
    colorBackground: '#ffffff',
    colorText: '#1e293b',
    colorDanger: '#ef4444',
    borderRadius: '8px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  rules: {
    '.Input': {
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
    },
    '.Input:focus': {
      border: '1px solid #2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    },
    '.Label': {
      fontWeight: '500',
      marginBottom: '8px',
      color: '#374151',
    },
    '.Error': {
      color: '#ef4444',
    },
  },
};

export function StripeElementsProvider({ 
  clientSecret, 
  children, 
  locale = 'en' 
}: StripeElementsProviderProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
        locale: locale as 'en' | 'de' | 'el',
      }}
    >
      {children}
    </Elements>
  );
}

export { stripePromise };