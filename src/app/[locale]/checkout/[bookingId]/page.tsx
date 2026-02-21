'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Booking, Payment } from '@/types';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm({ booking, onSuccess }: { booking: Booking | null; onSuccess: () => void }) {
  const t = useTranslations();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/payment/success?booking_id=${booking?.id}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border p-4">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-900 hover:bg-blue-800 h-12"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {t('payments.processing')}
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            {t('payments.pay')} {formatPrice(booking?.totalPrice || 0)}
          </>
        )}
      </Button>
    </form>
  );
}

function CheckoutContent({ bookingId, locale }: { bookingId: string; locale: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookingAndCreatePayment() {
      try {
        // Fetch booking details
        const bookingRes = await fetch(`/api/bookings/${bookingId}`);
        if (!bookingRes.ok) {
          throw new Error('Booking not found');
        }
        const bookingData = await bookingRes.json();
        setBooking(bookingData);

        // Create payment session
        const paymentRes = await fetch('/api/payments/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId, locale }),
        });
        
        if (!paymentRes.ok) {
          const paymentError = await paymentRes.json();
          throw new Error(paymentError.error || 'Failed to create payment session');
        }
        
        const paymentData = await paymentRes.json();
        
        if (paymentData.url) {
          // Using Checkout Session - redirect to Stripe
          window.location.href = paymentData.url;
        } else if (paymentData.clientSecret) {
          // Using Payment Element
          setClientSecret(paymentData.clientSecret);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load checkout');
        toast.error('Failed to load checkout');
      } finally {
        setIsLoading(false);
      }
    }

    loadBookingAndCreatePayment();
  }, [bookingId, locale]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('common.error')}</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={() => router.push(`/${locale}/booking`)} variant="outline">
          {t('booking.back')}
        </Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#1e3a5f',
      colorBackground: '#ffffff',
      colorText: '#1e293b',
      borderRadius: '8px',
    },
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Payment Form */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {t('payments.cardDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance,
              }}
            >
              <PaymentForm
                booking={booking}
                onSuccess={() => router.push(`/${locale}/payment/success?booking_id=${bookingId}`)}
              />
            </Elements>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>{t('booking.step4')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking && (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{booking.trip?.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatDate(booking.date, locale)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{t('booking.participants')}</span>
                    <span>{booking.participants}</span>
                  </div>
                  
                  {booking.bookingAddOns && booking.bookingAddOns.length > 0 && (
                    <div className="space-y-1">
                      {booking.bookingAddOns.map((addon) => (
                        <div key={addon.id} className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            {addon.addOn?.name} x{addon.quantity}
                          </span>
                          <span>{formatPrice(addon.price * addon.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>{t('payments.total')}</span>
                  <span className="text-blue-600">{formatPrice(booking.totalPrice)}</span>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <p>🔒 {t('payments.securePayment')}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const locale = params.locale as string;
  const t = useTranslations();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
            {t('payments.title')}
          </h1>
          <p className="text-slate-600">
            {t('payments.subtitle')}
          </p>
        </div>

        <CheckoutContent bookingId={bookingId} locale={locale} />
      </div>
    </div>
  );
}