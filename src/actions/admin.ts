'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { Booking, Trip, GalleryImage, ContactMessage, Review } from '@/types';

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function getAdminBookings(): Promise<Booking[]> {
  await requireAuth();
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      trip: true,
      bookingAddOns: { include: { addOn: true } },
      payment: true,
    },
  });
  return bookings.map((b) => ({
    ...b,
    bookingAddOns: b.bookingAddOns.map((ba) => ({
      ...ba,
      addOn: ba.addOn ? { ...ba.addOn, price: ba.price } : undefined,
    })),
  }));
}

export async function updateBookingStatus(id: string, status: string) {
  await requireAuth();
  await prisma.booking.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/bookings');
}

export async function getAdminTrips(): Promise<Trip[]> {
  await requireAuth();
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return trips.map((t) => ({
    ...t,
    images: JSON.parse(t.images),
    highlights: JSON.parse(t.highlights),
  }));
}

export async function createTrip(data: {
  name: string;
  description: string;
  duration: string;
  basePrice: number;
  maxParticipants: number;
  isPremium: boolean;
}): Promise<Trip> {
  await requireAuth();
  const trip = await prisma.trip.create({
    data: {
      ...data,
      images: '[]',
      highlights: '[]',
    },
  });
  revalidatePath('/admin/trips');
  revalidatePath('/trips');
  return { ...trip, images: [], highlights: [] };
}

export async function updateTrip(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    duration: string;
    basePrice: number;
    maxParticipants: number;
    isPremium: boolean;
    isActive: boolean;
  }>
): Promise<Trip> {
  await requireAuth();
  const trip = await prisma.trip.update({ where: { id }, data });
  revalidatePath('/admin/trips');
  revalidatePath('/trips');
  return {
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  };
}

export async function deleteTrip(id: string) {
  await requireAuth();
  await prisma.trip.update({ where: { id }, data: { isActive: false } });
  revalidatePath('/admin/trips');
  revalidatePath('/trips');
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  await requireAuth();
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function markMessageRead(id: string) {
  await requireAuth();
  await prisma.contactMessage.update({
    where: { id },
    data: { status: 'read' },
  });
  revalidatePath('/admin/messages');
}

export async function getAdminReviews(): Promise<Review[]> {
  await requireAuth();
  return prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { trip: true },
  });
}

export async function verifyReview(id: string) {
  await requireAuth();
  await prisma.review.update({ where: { id }, data: { isVerified: true } });
  revalidatePath('/admin/reviews');
}

export async function deleteReview(id: string) {
  await requireAuth();
  await prisma.review.delete({ where: { id } });
  revalidatePath('/admin/reviews');
}

export async function getAdminGallery(): Promise<GalleryImage[]> {
  await requireAuth();
  return prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  }) as Promise<GalleryImage[]>;
}

export async function createAdminUser(
  email: string,
  password: string,
  name: string
) {
  await requireAuth();
  const hashedPassword = await bcrypt.hash(password, 12);
  return prisma.adminUser.create({
    data: { email, password: hashedPassword, name },
  });
}
