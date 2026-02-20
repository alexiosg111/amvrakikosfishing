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

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { trip: true },
  });

  return NextResponse.json(reviews);
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, isVerified } = body;

  const review = await prisma.review.update({
    where: { id },
    data: { isVerified },
    include: { trip: true },
  });

  return NextResponse.json(review);
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  await prisma.review.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
