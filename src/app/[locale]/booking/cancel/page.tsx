import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, Mail, Phone, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BookingCancelPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bookingCancel' });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-slate-600 text-lg">
              {t('subtitle')}
            </p>
          </div>

          {/* Message Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-slate-600 mb-6">
                {t('message')}
              </p>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-slate-900 mb-2">
                  {t('whyCancelled')}
                </h3>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• {t('reason1')}</li>
                  <li>• {t('reason2')}</li>
                  <li>• {t('reason3')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Need Help Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-slate-900">
                {t('needHelp')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>bookings@amvrakikosfishing.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>+30 26820 29100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/booking`}>
              <Button className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800">
                {t('tryAgain')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button variant="outline" className="w-full sm:w-auto">
                {t('contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
