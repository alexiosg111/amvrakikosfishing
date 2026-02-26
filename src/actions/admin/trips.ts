'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Trip } from '@/types';

export interface TripFormData {
  name: string;
  description: string;
  duration: string;
  basePrice: number;
  maxParticipants: number;
  images: string[];
  highlights: string[];
  isPremium: boolean;
  isActive: boolean;
}

export interface TripFilters {
  search?: string;
  isActive?: boolean;
  isPremium?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export async function getAllTripsAdmin(filters: TripFilters = {}): Promise<Trip[]> {
  const { search, isActive, isPremium, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

  const where: Record<string, unknown> = {};

  if (search) {
    where.name = { contains: search };
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (isPremium !== undefined) {
    where.isPremium = isPremium;
  }

  const orderBy: Record<string, string> =
    sortBy === 'price'
      ? { basePrice: sortOrder }
      : sortBy === 'name'
      ? { name: sortOrder }
      : { createdAt: sortOrder };

  const trips = await prisma.trip.findMany({
    where,
    orderBy,
  });

  return trips.map((trip) => ({
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  }));
}

export async function createTrip(data: TripFormData): Promise<Trip> {
  const trip = await prisma.trip.create({
    data: {
      name: data.name,
      description: data.description,
      duration: data.duration,
      basePrice: data.basePrice,
      maxParticipants: data.maxParticipants,
      images: JSON.stringify(data.images),
      highlights: JSON.stringify(data.highlights),
      isPremium: data.isPremium,
      isActive: data.isActive,
    },
  });

  revalidatePath('/admin/trips');
  revalidatePath('/trips');

  return {
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  };
}

export async function updateTrip(id: string, data: TripFormData): Promise<Trip> {
  const trip = await prisma.trip.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      duration: data.duration,
      basePrice: data.basePrice,
      maxParticipants: data.maxParticipants,
      images: JSON.stringify(data.images),
      highlights: JSON.stringify(data.highlights),
      isPremium: data.isPremium,
      isActive: data.isActive,
    },
  });

  revalidatePath('/admin/trips');
  revalidatePath('/trips');

  return {
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  };
}

export async function deleteTrip(id: string): Promise<void> {
  await prisma.trip.delete({ where: { id } });
  revalidatePath('/admin/trips');
  revalidatePath('/trips');
}

export async function toggleTripStatus(id: string, isActive: boolean): Promise<Trip> {
  const trip = await prisma.trip.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath('/admin/trips');
  revalidatePath('/trips');

  return {
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  };
}

export async function duplicateTrip(id: string): Promise<Trip> {
  const original = await prisma.trip.findUnique({ where: { id } });
  if (!original) throw new Error('Trip not found');

  const trip = await prisma.trip.create({
    data: {
      name: `${original.name} (Copy)`,
      description: original.description,
      duration: original.duration,
      basePrice: original.basePrice,
      maxParticipants: original.maxParticipants,
      images: original.images,
      highlights: original.highlights,
      isPremium: original.isPremium,
      isActive: false,
    },
  });

  revalidatePath('/admin/trips');

  return {
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  };
}

export async function setTripAvailability(
  tripId: string,
  date: Date,
  availableSpots: number
) {
  const availability = await prisma.availability.upsert({
    where: { tripId_date: { tripId, date } },
    update: { availableSpots },
    create: { tripId, date, availableSpots },
  });

  revalidatePath('/admin/trips');
  return availability;
}

export async function getTripWithDetails(id: string) {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      availabilities: {
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        take: 60,
      },
      reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
      bookings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { payment: true },
      },
    },
  });

  if (!trip) return null;

  return {
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  };
}
