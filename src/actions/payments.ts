'use server';

import { prisma } from '@/lib/db';
import { stripe, createCheckoutSession } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';

export async function createPaymentSession({
  bookingId,
  email,
}: {
  bookingId: string;
  email: string;
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { trip: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'PAID') {
    throw new Error('Booking is already paid');
  }

  const session = await createCheckoutSession({
    bookingId: booking.id,
    amount: booking.totalPrice,
    email,
    tripName: booking.trip.name,
    metadata: {
      bookingId: booking.id,
      tripId: booking.tripId,
      participants: booking.participants.toString(),
    },
  });

  return { sessionId: session.id, url: session.url };
}

export async function handlePaymentSuccess(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed');
  }

  const bookingId = session.metadata?.bookingId;
  
  if (!bookingId) {
    throw new Error('Booking ID not found in session');
  }

  // Update booking status
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'PAID' },
  });

  // Create or update payment record
  await prisma.payment.upsert({
    where: { bookingId },
    create: {
      bookingId,
      stripePaymentId: session.payment_intent as string,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      status: 'completed',
    },
    update: {
      stripePaymentId: session.payment_intent as string,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      status: 'completed',
    },
  });

  revalidatePath('/admin');
  revalidatePath(`/booking/success`);

  return { success: true, bookingId };
}

export async function getPaymentStatus(bookingId: string) {
  const payment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true },
  });

  return {
    isPaid: booking?.status === 'PAID',
    payment,
    status: booking?.status,
  };
}
