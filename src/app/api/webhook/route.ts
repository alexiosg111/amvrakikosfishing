import { NextRequest, NextResponse } from 'next/server';
import { stripe, constructWebhookEvent } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendPaymentReceipt, sendBookingConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event;

  try {
    event = constructWebhookEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        console.error('No booking ID in session metadata');
        return NextResponse.json({ error: 'No booking ID' }, { status: 400 });
      }

      try {
        // Update booking status
        const booking = await prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'PAID' },
          include: { trip: true },
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

        // Send payment receipt email
        await sendPaymentReceipt({
          to: booking.contactEmail,
          bookingId: booking.id,
          amount: booking.totalPrice,
          name: booking.contactName,
        });

        console.log(`Payment completed for booking ${bookingId}`);
      } catch (error) {
        console.error('Error processing payment success:', error);
        return NextResponse.json(
          { error: 'Failed to process payment' },
          { status: 500 }
        );
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.error(`Payment failed: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
