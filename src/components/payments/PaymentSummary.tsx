'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { Booking } from '@/types';
import { Calendar, Users, MapPin } from 'lucide-react';

interface PaymentSummaryProps {
  booking: Booking;
  locale?: string;
  showStatus?: boolean;
}

export function PaymentSummary({ booking, locale = 'en', showStatus = true }: PaymentSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PAID':
      case 'SUCCEEDED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trip Info */}
        <div>
          <p className="font-semibold text-lg">{booking.trip?.name}</p>
          {showStatus && (
            <Badge variant="outline" className={`mt-2 ${getStatusColor(booking.status)}`}>
              {booking.status}
            </Badge>
          )}
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{formatDate(booking.date, locale)}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Users className="w-4 h-4 text-blue-600" />
            <span>{booking.participants} participants</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Amvrakikos Bay, Preveza</span>
          </div>
        </div>

        {/* Add-ons */}
        {booking.bookingAddOns && booking.bookingAddOns.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">Add-ons</p>
              {booking.bookingAddOns.map((addon) => (
                <div key={addon.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    {addon.addOn?.name} x{addon.quantity}
                  </span>
                  <span>{formatPrice(addon.price * addon.quantity)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(booking.totalPrice)}
          </span>
        </div>

        {/* Payment Info */}
        {booking.payment && (
          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
            <p>Payment ID: {booking.payment.id.slice(0, 8)}...</p>
            <p>Method: {booking.payment.paymentMethod || 'Card'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}