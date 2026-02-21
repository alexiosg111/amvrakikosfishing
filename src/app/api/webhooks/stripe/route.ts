import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, retrievePaymentIntent } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendPaymentSuccessNotifications, sendPaymentFailedEmail } from '@/actions/emails';
import { processRefund } from '@/actions/payments';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event;
    try {
      event = constructWebhookEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          console.error('No booking ID in session metadata');
          break;
        }

        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;

        const receiptUrl = session.customer_details?.email
          ? `https://dashboard.stripe.com/payments/${paymentIntentId}`
          : undefined;

        // Update payment and booking status
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { bookingId },
            data: {
              status: 'SUCCEEDED',
              stripePaymentId: paymentIntentId,
              receiptUrl,
              paymentMethod: session.payment_method_types?.[0] || 'card',
            },
          });

          await tx.booking.update({
            where: { id: bookingId },
            data: { status: 'PAID' },
          });
        });

        // Send confirmation emails
        await sendPaymentSuccessNotifications(bookingId, receiptUrl);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (!bookingId) {
          console.error('No booking ID in payment intent metadata');
          break;
        }

        // Check if payment already processed (might be duplicate from checkout.session.completed)
        const existingPayment = await prisma.payment.findUnique({
          where: { bookingId },
        });

        if (existingPayment?.status === 'SUCCEEDED') {
          console.log('Payment already processed, skipping');
          break;
        }

        const receiptUrl = paymentIntent.latest_charge?.receipt_url;

        await prisma.$transaction(async (tx) => {
          await tx.payment.upsert({
            where: { bookingId },
            create: {
              bookingId,
              stripePaymentId: paymentIntent.id,
              amount: Math.round(paymentIntent.amount / 100),
              status: 'SUCCEEDED',
              receiptUrl,
              paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
            },
            update: {
              stripePaymentId: paymentIntent.id,
              status: 'SUCCEEDED',
              receiptUrl,
            },
          });

          await tx.booking.update({
            where: { id: bookingId },
            data: { status: 'PAID' },
          });
        });

        // Send confirmation emails
        await sendPaymentSuccessNotifications(bookingId, receiptUrl || undefined);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (!bookingId) {
          console.error('No booking ID in payment intent metadata');
          break;
        }

        const failureMessage = paymentIntent.last_payment_error?.message || 'Payment failed';
        
        await prisma.payment.update({
          where: { bookingId },
          data: {
            stripePaymentId: paymentIntent.id,
            status: 'FAILED',
            failureReason: failureMessage,
          },
        });

        // Get locale for email
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
        });

        if (booking) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const locale = paymentIntent.metadata?.locale || 'en';
          const retryUrl = `${appUrl}/${locale}/checkout/${bookingId}`;

          await sendPaymentFailedEmail(bookingId, retryUrl);
        }
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (!bookingId) {
          console.error('No booking ID in payment intent metadata');
          break;
        }

        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { bookingId },
            data: {
              stripePaymentId: paymentIntent.id,
              status: 'CANCELLED',
              failureReason: 'Payment canceled by user',
            },
          });

          await tx.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' },
          });
        });
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const paymentIntentId = charge.payment_intent as string;

        if (!paymentIntentId) {
          console.error('No payment intent ID in charge');
          break;
        }

        const payment = await prisma.payment.findUnique({
          where: { stripePaymentId: paymentIntentId },
        });

        if (!payment) {
          console.error('Payment not found for refunded charge');
          break;
        }

        const refundAmount = Math.round(charge.amount_refunded / 100);

        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              refundedAmount: refundAmount,
              status: refundAmount >= payment.amount ? 'REFUNDED' : 'SUCCEEDED',
            },
          });

          if (refundAmount >= payment.amount) {
            await tx.booking.update({
              where: { id: payment.bookingId },
              data: { status: 'CANCELLED' },
            });
          }
        });

        // Send cancellation email with refund info
        const { sendCancellationEmailNotification } = await import('@/actions/emails');
        await sendCancellationEmailNotification(
          payment.bookingId,
          refundAmount,
          'completed'
        );
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object;
        const paymentIntentId = dispute.payment_intent as string;

        console.log(`Dispute created for payment intent: ${paymentIntentId}`);
        // Handle dispute - you might want to notify admin or update status
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}