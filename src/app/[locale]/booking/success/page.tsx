'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { handlePaymentSuccess, getPaymentStatus } from '@/actions/payments';
import { getBookingById } from '@/actions/bookings';
import { Booking } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

export default function PaymentSuccessPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('id');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function processPayment() {
      try {
        if (sessionId) {
          // Payment was made through Stripe
          const result = await handlePaymentSuccess(sessionId);
          if (result.success && result.bookingId) {
            const bookingData = await getBookingById(result.bookingId);
            setBooking(bookingData);
          }
        } else if (bookingId) {
          // Direct booking without payment
          const bookingData = await getBookingById(bookingId);
          setBooking(bookingData);
        } else {
          setError('No booking information found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to process payment');
      } finally {
        setIsLoading(false);
      }
    }

    processPayment();
  }, [sessionId, bookingId]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">✕</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-slate-600 mb-6">{error}</p>
              <Link href="/booking">
                <Button>Try Again</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-green-200">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {t('booking.success')}
                </h1>
                <p className="text-slate-600">{t('booking.successMessage')}</p>
              </div>

              {booking && (
                <div className="bg-slate-50 rounded-xl p-6 mb-8">
                  <h2 className="font-semibold text-lg mb-4">Booking Details</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Booking ID:</span>
                      <span className="font-medium">{booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Trip:</span>
                      <span className="font-medium">{booking.trip?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Date:</span>
                      <span className="font-medium">
                        {formatDate(new Date(booking.date))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Participants:</span>
                      <span className="font-medium">{booking.participants}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t mt-2">
                      <span className="text-slate-900 font-semibold">Total Paid:</span>
                      <span className="font-bold text-blue-600">
                        {formatPrice(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl mb-8">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  A confirmation email has been sent to{' '}
                  <strong>{booking?.contactEmail}</strong> with your booking details.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/trips">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Browse More Trips
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
