'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface PaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  submitText?: string;
}

export function PaymentForm({ amount, onSuccess, onError, submitText }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      const message = error.message || 'Payment failed. Please try again.';
      setErrorMessage(message);
      onError?.(message);
      setIsProcessing(false);
    } else {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-slate-200 p-4 bg-white">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Payment Error</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-900 hover:bg-blue-800 h-12 text-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            {submitText || `Pay ${formatPrice(amount)}`}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-slate-500">
        🔒 Your payment is secured with SSL encryption
      </p>
    </form>
  );
}