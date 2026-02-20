import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendBookingConfirmation, sendPaymentReceipt } from '@/lib/email';

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event;
  try {
    event = constructWebhookEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return NextResponse.json({ error: 'No booking ID in session' }, { status: 400 });
    }

    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'PAID' },
        include: { trip: true },
      });

      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          stripePaymentId: session.payment_intent || session.id,
          amount: booking.totalPrice,
          status: 'completed',
        },
      });

      try {
        await sendBookingConfirmation({
          to: booking.contactEmail,
          bookingId: booking.id,
          tripName: booking.trip?.name || 'Fishing Trip',
          date: booking.date,
          participants: booking.participants,
          totalPrice: booking.totalPrice,
          name: booking.contactName,
        });

        await sendPaymentReceipt({
          to: booking.contactEmail,
          bookingId: booking.id,
          amount: booking.totalPrice,
          name: booking.contactName,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation emails:', emailError);
      }
    } catch (error) {
      console.error('Failed to update booking after payment:', error);
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
