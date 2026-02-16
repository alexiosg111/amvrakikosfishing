'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, CreditCard, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const t = useTranslations();

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <XCircle className="w-10 h-10 text-amber-600" />
                </motion.div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Payment Cancelled
                </h1>
                <p className="text-slate-600">
                  Your payment was cancelled. Don&apos;t worry, your booking is still reserved for 30 minutes.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">Try Payment Again</h3>
                    <p className="text-sm text-slate-600">
                      You can complete your payment at any time. Your booking will be held for 30 minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">Need Help?</h3>
                    <p className="text-sm text-slate-600">
                      If you&apos;re having trouble with payment, please contact us and we&apos;ll be happy to help.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Return to Booking
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800">
                    Contact Support
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
