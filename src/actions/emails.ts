'use server';

import {
  sendBookingConfirmation,
  sendPaymentReceipt,
  sendPaymentFailed,
  sendBookingReminder,
  sendReviewRequest,
  sendCancellationEmail,
} from '@/lib/email';
import { prisma } from '@/lib/db';

export async function sendBookingConfirmationEmail(bookingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: true,
        bookingAddOns: {
          include: { addOn: true },
        },
      },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    await sendBookingConfirmation({
      to: booking.contactEmail,
      name: booking.contactName,
      bookingId: booking.id,
      tripName: booking.trip.name,
      date: booking.date,
      participants: booking.participants,
      totalPrice: booking.totalPrice,
      addOns: booking.bookingAddOns.map(ba => ({
        name: ba.addOn?.name || '',
        quantity: ba.quantity,
        price: ba.price,
      })),
      meetingPoint: 'Amvrakikos Bay Marina, Preveza',
      startTime: '08:00',
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, error: 'Failed to send confirmation email' };
  }
}

export async function sendPaymentReceiptEmail(
  bookingId: string,
  receiptUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking || !booking.payment) {
      return { success: false, error: 'Booking or payment not found' };
    }

    await sendPaymentReceipt({
      to: booking.contactEmail,
      name: booking.contactName,
      bookingId: booking.id,
      amount: booking.payment.amount,
      receiptUrl,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending payment receipt email:', error);
    return { success: false, error: 'Failed to send receipt email' };
  }
}

export async function sendPaymentFailedEmail(
  bookingId: string,
  retryUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    await sendPaymentFailed({
      to: booking.contactEmail,
      name: booking.contactName,
      bookingId: booking.id,
      amount: booking.totalPrice,
      retryUrl,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending payment failed email:', error);
    return { success: false, error: 'Failed to send payment failed email' };
  }
}

export async function sendBookingReminderEmail(bookingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    await sendBookingReminder({
      to: booking.contactEmail,
      name: booking.contactName,
      bookingId: booking.id,
      tripName: booking.trip.name,
      date: booking.date,
      meetingPoint: 'Amvrakikos Bay Marina, Preveza',
      startTime: '08:00',
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending booking reminder email:', error);
    return { success: false, error: 'Failed to send reminder email' };
  }
}

export async function sendReviewRequestEmail(bookingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const reviewUrl = `${appUrl}/en/reviews?trip=${booking.tripId}&booking=${booking.id}`;

    await sendReviewRequest({
      to: booking.contactEmail,
      name: booking.contactName,
      bookingId: booking.id,
      tripName: booking.trip.name,
      reviewUrl,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending review request email:', error);
    return { success: false, error: 'Failed to send review request email' };
  }
}

export async function sendCancellationEmailNotification(
  bookingId: string,
  refundAmount?: number,
  refundStatus?: 'processing' | 'completed' | 'pending'
): Promise<{ success: boolean; error?: string }> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true, payment: true },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    await sendCancellationEmail({
      to: booking.contactEmail,
      name: booking.contactName,
      bookingId: booking.id,
      tripName: booking.trip.name,
      date: booking.date,
      refundAmount,
      refundStatus,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return { success: false, error: 'Failed to send cancellation email' };
  }
}

export async function sendPaymentSuccessNotifications(
  bookingId: string,
  receiptUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const [confirmationResult, receiptResult] = await Promise.all([
      sendBookingConfirmationEmail(bookingId),
      sendPaymentReceiptEmail(bookingId, receiptUrl),
    ]);

    if (!confirmationResult.success || !receiptResult.success) {
      return { 
        success: false, 
        error: confirmationResult.error || receiptResult.error 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending payment success notifications:', error);
    return { success: false, error: 'Failed to send notifications' };
  }
}