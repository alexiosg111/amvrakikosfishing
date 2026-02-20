import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.cookies.get('amvrakikos-admin-session');
  return cookieHeader?.value === 'authenticated';
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      trip: true,
      payment: true,
    },
  });

  return NextResponse.json(bookings);
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, status } = body;

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
    include: { trip: true },
  });

  return NextResponse.json(booking);
}
