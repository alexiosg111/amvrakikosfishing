import { NextRequest, NextResponse } from 'next/server';
import { stripe, constructWebhookEvent } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendPaymentReceipt } from '@/lib/email';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    const locale = session.metadata?.locale ?? 'en';

    if (!bookingId) {
      console.error('Missing bookingId in webhook metadata');
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    try {
      // 1. Update booking status to PAID
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'PAID' },
        include: { trip: true },
      });

      // 2. Create/update Payment record
      await prisma.payment.upsert({
        where: { bookingId },
        create: {
          bookingId,
          stripePaymentId: (session.payment_intent as string) || '',
          amount: (session.amount_total ?? 0) / 100,
          status: 'paid',
        },
        update: {
          status: 'paid',
          stripePaymentId: (session.payment_intent as string) || '',
          amount: (session.amount_total ?? 0) / 100,
        },
      });

      // 3. Send payment receipt email
      try {
        await sendPaymentReceipt({
          to: booking.contactEmail,
          bookingId: booking.id,
          amount: (session.amount_total ?? 0) / 100,
          name: booking.contactName,
          tripName: booking.trip?.name || '',
          date: booking.date,
          participants: booking.participants,
          locale,
        });
        console.log('Payment receipt sent for booking:', bookingId);
      } catch (emailErr) {
        console.error('Failed to send payment receipt:', emailErr);
      }

      console.log('Payment completed for booking:', bookingId);
    } catch (err) {
      console.error('Error processing payment webhook:', err);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      try {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'CANCELLED' },
        });
        console.log('Booking cancelled due to expiration:', bookingId);
      } catch (err) {
        console.error('Error updating cancelled booking:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
