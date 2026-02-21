'use server';

import { prisma } from '@/lib/db';
import { 
  createCheckoutSession, 
  retrieveCheckoutSession, 
  retrievePaymentIntent,
  createRefund,
  formatAmountFromStripe 
} from '@/lib/stripe';
import { Payment, PaymentStatus } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createPaymentSession({
  bookingId,
  locale = 'en',
}: {
  bookingId: string;
  locale?: string;
}): Promise<{ url?: string; error?: string }> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });

    if (!booking) {
      return { error: 'Booking not found' };
    }

    if (booking.status === 'PAID') {
      return { error: 'Booking already paid' };
    }

    const session = await createCheckoutSession({
      bookingId: booking.id,
      amount: booking.totalPrice,
      email: booking.contactEmail,
      tripName: booking.trip.name,
      locale,
      metadata: {
        tripId: booking.tripId,
        participants: booking.participants.toString(),
      },
    });

    // Create or update payment record
    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        stripeCheckoutSession: session.id,
        amount: booking.totalPrice,
        status: 'PENDING',
      },
      update: {
        stripeCheckoutSession: session.id,
        status: 'PENDING',
      },
    });

    return { url: session.url || undefined };
  } catch (error) {
    console.error('Error creating payment session:', error);
    return { error: 'Failed to create payment session' };
  }
}

export async function getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
  const payment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  return payment;
}

export async function updatePaymentStatus({
  bookingId,
  status,
  stripePaymentId,
  receiptUrl,
  failureReason,
  paymentMethod,
}: {
  bookingId: string;
  status: PaymentStatus;
  stripePaymentId?: string;
  receiptUrl?: string;
  failureReason?: string;
  paymentMethod?: string;
}): Promise<Payment> {
  const payment = await prisma.payment.update({
    where: { bookingId },
    data: {
      status,
      stripePaymentId,
      receiptUrl,
      failureReason,
      paymentMethod,
    },
  });

  return payment;
}

export async function handlePaymentSuccess({
  bookingId,
  paymentIntentId,
  receiptUrl,
}: {
  bookingId: string;
  paymentIntentId: string;
  receiptUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction(async (tx) => {
      // Update payment status
      await tx.payment.update({
        where: { bookingId },
        data: {
          status: 'SUCCEEDED',
          stripePaymentId: paymentIntentId,
          receiptUrl,
        },
      });

      // Update booking status
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'PAID' },
      });
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error handling payment success:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}

export async function handlePaymentFailure({
  bookingId,
  paymentIntentId,
  failureReason,
}: {
  bookingId: string;
  paymentIntentId?: string;
  failureReason?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.payment.update({
      where: { bookingId },
      data: {
        status: 'FAILED',
        stripePaymentId: paymentIntentId,
        failureReason,
      },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error handling payment failure:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}

export async function processRefund({
  bookingId,
  amount,
  reason,
}: {
  bookingId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
}): Promise<{ success: boolean; error?: string; refundId?: string }> {
  try {
    const payment = await prisma.payment.findUnique({
      where: { bookingId },
    });

    if (!payment || !payment.stripePaymentId) {
      return { success: false, error: 'Payment not found or no Stripe payment ID' };
    }

    if (payment.status !== 'SUCCEEDED') {
      return { success: false, error: 'Payment not in succeeded state' };
    }

    const refund = await createRefund({
      paymentIntentId: payment.stripePaymentId,
      amount,
      reason,
    });

    const refundAmount = amount ? amount : payment.amount - payment.refundedAmount;
    
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { bookingId },
        data: {
          refundedAmount: { increment: refundAmount },
          status: refundAmount >= payment.amount ? 'REFUNDED' : 'SUCCEEDED',
        },
      });

      if (refundAmount >= payment.amount) {
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: 'CANCELLED' },
        });
      }
    });

    revalidatePath('/admin');
    return { success: true, refundId: refund.id };
  } catch (error) {
    console.error('Error processing refund:', error);
    return { success: false, error: 'Failed to process refund' };
  }
}

export async function verifyPaymentSession(sessionId: string): Promise<{
  success: boolean;
  bookingId?: string;
  paymentStatus?: string;
  error?: string;
}> {
  try {
    const session = await retrieveCheckoutSession(sessionId);
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return { success: false, error: 'Booking ID not found in session' };
    }

    const paymentStatus = session.payment_status;
    const paymentIntentId = typeof session.payment_intent === 'string' 
      ? session.payment_intent 
      : session.payment_intent?.id;

    return {
      success: paymentStatus === 'paid',
      bookingId,
      paymentStatus,
    };
  } catch (error) {
    console.error('Error verifying payment session:', error);
    return { success: false, error: 'Failed to verify payment session' };
  }
}

export async function getPaymentDetails(paymentIntentId: string): Promise<{
  amount: number;
  status: string;
  receiptUrl?: string;
  error?: string;
}> {
  try {
    const paymentIntent = await retrievePaymentIntent(paymentIntentId);
    
    return {
      amount: formatAmountFromStripe(paymentIntent.amount),
      status: paymentIntent.status,
      receiptUrl: paymentIntent.latest_charge?.receipt_url,
    };
  } catch (error) {
    console.error('Error retrieving payment details:', error);
    return { amount: 0, status: 'unknown', error: 'Failed to retrieve payment details' };
  }
}