'use server';

import { prisma } from '@/lib/db';
import { Trip, Review, Availability } from '@/types';

export async function getTrips(): Promise<Trip[]> {
  const trips = await prisma.trip.findMany({
    where: { isActive: true },
    orderBy: [
      { isPremium: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return trips.map(trip => ({
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  }));
}

export async function getTripById(id: string): Promise<Trip | null> {
  const trip = await prisma.trip.findUnique({
    where: { id, isActive: true },
  });

  if (!trip) return null;

  return {
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  };
}

export async function getPremiumTrips(): Promise<Trip[]> {
  const trips = await prisma.trip.findMany({
    where: { isActive: true, isPremium: true },
    orderBy: { createdAt: 'desc' },
  });

  return trips.map(trip => ({
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  }));
}

export async function getTripReviews(tripId: string): Promise<Review[]> {
  return await prisma.review.findMany({
    where: { tripId, isVerified: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
}

export async function checkAvailability(tripId: string, date: Date): Promise<number> {
  const availability = await prisma.availability.findUnique({
    where: {
      tripId_date: {
        tripId,
        date,
      },
    },
  });

  if (availability) {
    return availability.availableSpots;
  }

  // If no availability record exists, return the max participants for the trip
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  return trip?.maxParticipants || 0;
}

export async function getAvailableDates(tripId: string, startDate: Date, endDate: Date): Promise<Date[]> {
  const availabilities = await prisma.availability.findMany({
    where: {
      tripId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      availableSpots: {
        gt: 0,
      },
    },
  });

  return availabilities.map(a => a.date);
}
