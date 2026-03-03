import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { retrieveCheckoutSession } from '@/lib/stripe';
import { getBookingById } from '@/actions/bookings';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, Calendar, Users, MapPin } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; id?: string }>;
}

async function SuccessContent({ locale, searchParams }: { locale: string; searchParams: { session_id?: string; id?: string } }) {
  const t = await getTranslations({ locale, namespace: 'bookingSuccess' });
  
  const { session_id, id } = searchParams;
  const sessionId = session_id;
  const bookingId = id;

  let booking = null;
  let customerEmail = '';
  let amountPaid = 0;

  if (sessionId) {
    try {
      const session = await retrieveCheckoutSession(sessionId);
      const bId = session.metadata?.bookingId;
      if (bId) {
        booking = await getBookingById(bId);
        customerEmail = session.customer_email || '';
        amountPaid = (session.amount_total ?? 0) / 100;
      }
    } catch (error) {
      console.error('Failed to retrieve session:', error);
    }
  } else if (bookingId) {
    booking = await getBookingById(bookingId);
    if (booking) {
      amountPaid = booking.totalPrice;
      customerEmail = booking.contactEmail;
    }
  }

  if (!booking) {
    // Still show success if we don't have booking data
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-slate-600 text-lg mb-8">
          {t('subtitle')}
        </p>
        <p className="text-slate-500">
          {t('emailSent')}
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href={`/${locale}`}>
            <Button className="bg-blue-900 hover:bg-blue-800">
              {t('backHome')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-slate-600 text-lg">
          {t('subtitle')}
        </p>
      </div>

      {/* Booking Details Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4 text-slate-900">
            {t('bookingDetails')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('date')}
              </span>
              <span className="font-medium text-slate-900">
                {new Date(booking.date).toLocaleDateString(locale === 'el' ? 'el-GR' : locale === 'de' ? 'de-DE' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-slate-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('trip')}
              </span>
              <span className="font-medium text-slate-900">
                {booking.trip?.name || '-'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('participants')}
              </span>
              <span className="font-medium text-slate-900">
                {booking.participants}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-slate-600 font-medium">{t('totalPaid')}</span>
              <span className="font-bold text-xl text-green-600">
                €{amountPaid}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Reference */}
      <div className="bg-blue-50 rounded-lg p-4 mb-8 text-center">
        <p className="text-sm text-blue-600 mb-1">{t('bookingRef')}</p>
        <p className="font-mono text-lg font-bold text-blue-900">#{booking.id}</p>
      </div>

      {/* Email Confirmation */}
      <p className="text-center text-slate-600 mb-2">
        {t('emailSent')} <span className="font-medium">{customerEmail}</span>
      </p>
      <p className="text-center text-slate-500 mb-8">
        {t('receipt')}
      </p>

      {/* Next Steps */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-slate-900">
            {t('nextSteps')}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium flex-shrink-0">1</span>
              <span className="text-slate-600">{t('step1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium flex-shrink-0">2</span>
              <span className="text-slate-600">{t('step2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium flex-shrink-0">3</span>
              <span className="text-slate-600">{t('step3')}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href={`/${locale}`}>
          <Button className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800">
            {t('backHome')}
          </Button>
        </Link>
        <Link href={`/${locale}/trips`}>
          <Button variant="outline" className="w-full sm:w-auto">
            {t('moreTrips')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function BookingSuccessPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  
  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }>
          <SuccessContent locale={locale} searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  );
}
