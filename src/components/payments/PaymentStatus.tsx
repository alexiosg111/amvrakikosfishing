'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  XCircle,
  RefreshCcw 
} from 'lucide-react';
import { PaymentStatus as PaymentStatusType } from '@/types';

interface PaymentStatusProps {
  status: PaymentStatusType | 'loading';
  title?: string;
  message?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

const statusConfig = {
  loading: {
    icon: Loader2,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    title: 'Processing Payment',
    message: 'Please wait while we process your payment...',
    animate: true,
  },
  PENDING: {
    icon: Clock,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    title: 'Payment Pending',
    message: 'Your payment is pending. Please complete the payment process.',
    animate: false,
  },
  PROCESSING: {
    icon: Loader2,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    title: 'Processing Payment',
    message: 'Your payment is being processed.',
    animate: true,
  },
  SUCCEEDED: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    title: 'Payment Successful',
    message: 'Your payment has been processed successfully.',
    animate: false,
  },
  FAILED: {
    icon: AlertCircle,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    title: 'Payment Failed',
    message: 'We couldn\'t process your payment. Please try again.',
    animate: false,
  },
  CANCELLED: {
    icon: XCircle,
    iconColor: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    title: 'Payment Cancelled',
    message: 'Your payment was cancelled.',
    animate: false,
  },
  REFUNDED: {
    icon: RefreshCcw,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    title: 'Payment Refunded',
    message: 'Your payment has been refunded.',
    animate: false,
  },
};

export function PaymentStatus({ 
  status, 
  title, 
  message, 
  onRetry,
  children 
}: PaymentStatusProps) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Card className={`border ${config.borderColor}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-4`}>
            <Icon 
              className={`w-8 h-8 ${config.iconColor} ${config.animate ? 'animate-spin' : ''}`} 
            />
          </div>
          
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {title || config.title}
          </h3>
          
          <p className="text-slate-600 mb-4 max-w-md">
            {message || config.message}
          </p>

          {children}

          {status === 'FAILED' && onRetry && (
            <Button onClick={onRetry} className="mt-4">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}