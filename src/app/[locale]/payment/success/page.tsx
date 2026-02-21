'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Calendar, Users, Mail, Phone, ArrowRight } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Booking } from '@/types';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const locale = params.locale as string;
  
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        if (sessionId) {
          // Verify checkout session
          const res = await fetch(`/api/payments/verify-session?session_id=${sessionId}`);
          const data = await res.json();
          
          if (data.success && data.bookingId) {
            // Fetch booking details
            const bookingRes = await fetch(`/api/bookings/${data.bookingId}`);
            if (bookingRes.ok) {
              const bookingData = await bookingRes.json();
              setBooking(bookingData);
            }
          } else {
            setError(data.error || 'Payment verification failed');
          }
        } else if (bookingId) {
          // Direct booking lookup
          const bookingRes = await fetch(`/api/bookings/${bookingId}`);
          if (bookingRes.ok) {
            const bookingData = await bookingRes.json();
            setBooking(bookingData);
          } else {
            setError('Booking not found');
          }
        } else {
          setError('No payment information provided');
        }
      } catch (err) {
        setError('Failed to load payment details');
      } finally {
        setIsLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId, bookingId]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">{t('payments.verifying')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {t('payments.verificationFailed')}
            </h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={() => router.push(`/${locale}/booking`)} variant="outline">
              {t('booking.back')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t('payments.success')}
          </h1>
          <p className="text-slate-600">
            {t('payments.successMessage')}
          </p>
        </div>

        {/* Booking Details Card */}
        {booking && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {t('booking.step4')}
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('booking.trip')}</span>
                  <span className="font-medium">{booking.trip?.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('booking.date')}</span>
                  <span className="font-medium">{formatDate(booking.date, locale)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('booking.participants')}</span>
                  <span className="font-medium">{booking.participants}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('payments.totalPaid')}</span>
                    <span className="text-green-600">{formatPrice(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">{t('payments.confirmationSent')}</p>
                    <p className="text-sm text-blue-700">{booking.contactEmail}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* What's Next Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">
              {t('payments.whatsNext')}
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">1</span>
                <span className="text-slate-700">{t('payments.step1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">2</span>
                <span className="text-slate-700">{t('payments.step2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">3</span>
                <span className="text-slate-700">{t('payments.step3')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">{t('contact.title')}</h2>
            <div className="flex items-center gap-3 text-slate-700">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>+30 123 456 7890</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">{t('contact.location')}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 bg-blue-900 hover:bg-blue-800">
            <Link href={`/${locale}/trips`}>
              {t('trips.title')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/${locale}`}>
              {t('navigation.home')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}