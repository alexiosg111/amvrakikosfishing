import { NextRequest, NextResponse } from 'next/server';
import { createPaymentSession } from '@/actions/payments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, locale } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const result = await createPaymentSession({
      bookingId,
      locale: locale || 'en',
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      url: result.url,
    });
  } catch (error) {
    console.error('Error creating payment session:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}