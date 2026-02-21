'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Booking } from '@/types';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const locale = params.locale as string;
  
  const bookingId = searchParams.get('booking_id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        }
      } catch (err) {
        console.error('Failed to load booking:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBooking();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-lg">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t('payments.cancelled')}
          </h1>
          <p className="text-slate-600">
            {t('payments.cancelledMessage')}
          </p>
        </div>

        {/* Booking Info Card */}
        {booking && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">{t('booking.step4')}</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('booking.trip')}</span>
                  <span className="font-medium">{booking.trip?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('booking.total')}</span>
                  <span className="font-bold text-lg">{formatPrice(booking.totalPrice)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                <p>{t('payments.bookingPending')}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">{t('payments.needHelp')}</h3>
            <p className="text-slate-600 text-sm mb-4">
              {t('payments.helpMessage')}
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/${locale}/contact`}>
                {t('contact.title')}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {booking && (
            <Button 
              className="w-full bg-blue-900 hover:bg-blue-800"
              onClick={() => router.push(`/${locale}/checkout/${booking.id}`)}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              {t('payments.tryAgain')}
            </Button>
          )}
          
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/${locale}/booking`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('booking.back')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}