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

  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, imageUrl, category } = body;

  if (!title || !imageUrl || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const image = await prisma.galleryImage.create({
    data: { title, description, imageUrl, category },
  });

  return NextResponse.json(image);
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, isActive } = body;

  const image = await prisma.galleryImage.update({
    where: { id },
    data: { isActive },
  });

  return NextResponse.json(image);
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

  await prisma.galleryImage.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
