import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSession } from '@/actions/payments';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const result = await verifyPaymentSession(sessionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error verifying payment session:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment session' },
      { status: 500 }
    );
  }
}