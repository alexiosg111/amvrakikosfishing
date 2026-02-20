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

  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { bookings: true, reviews: true },
      },
    },
  });

  return NextResponse.json(
    trips.map((trip) => ({
      ...trip,
      images: JSON.parse(trip.images),
      highlights: JSON.parse(trip.highlights),
    }))
  );
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, duration, basePrice, maxParticipants, images, highlights, isPremium } = body;

  const trip = await prisma.trip.create({
    data: {
      name,
      description,
      duration,
      basePrice,
      maxParticipants,
      images: JSON.stringify(images || []),
      highlights: JSON.stringify(highlights || []),
      isPremium: isPremium || false,
    },
  });

  return NextResponse.json({
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  });
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  const updateData: any = { ...data };
  if (data.images) updateData.images = JSON.stringify(data.images);
  if (data.highlights) updateData.highlights = JSON.stringify(data.highlights);

  const trip = await prisma.trip.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  });
}
