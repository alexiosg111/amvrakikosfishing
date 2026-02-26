'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { BookingStatus } from '@/types';

export interface BookingFilters {
  search?: string;
  status?: BookingStatus | 'ALL';
  tripId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  pageSize?: number;
  sortBy?: 'date' | 'price' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export async function getAllBookings(filters: BookingFilters = {}) {
  const {
    search,
    status,
    tripId,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { contactName: { contains: search } },
      { contactEmail: { contains: search } },
      { id: { contains: search } },
    ];
  }

  if (status && status !== 'ALL') {
    where.status = status;
  }

  if (tripId) {
    where.tripId = tripId;
  }

  if (dateFrom || dateTo) {
    where.date = {
      ...(dateFrom && { gte: dateFrom }),
      ...(dateTo && { lte: dateTo }),
    };
  }

  const orderBy: Record<string, string> =
    sortBy === 'price'
      ? { totalPrice: sortOrder }
      : sortBy === 'date'
      ? { date: sortOrder }
      : sortBy === 'status'
      ? { status: sortOrder }
      : { createdAt: sortOrder };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        trip: true,
        bookingAddOns: { include: { addOn: true } },
        payment: true,
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    bookings: bookings.map((b) => ({
      ...b,
      trip: b.trip
        ? {
            ...b.trip,
            images: JSON.parse(b.trip.images),
            highlights: JSON.parse(b.trip.highlights),
          }
        : undefined,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function adminUpdateBookingStatus(id: string, status: BookingStatus) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
    include: { trip: true, payment: true },
  });

  revalidatePath('/admin/bookings');
  revalidatePath('/admin');

  return {
    ...booking,
    trip: booking.trip
      ? {
          ...booking.trip,
          images: JSON.parse(booking.trip.images),
          highlights: JSON.parse(booking.trip.highlights),
        }
      : undefined,
  };
}

export async function addBookingNote(id: string, notes: string) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { notes },
  });

  revalidatePath('/admin/bookings');
  return booking;
}

export async function getBookingForAdmin(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      trip: true,
      bookingAddOns: { include: { addOn: true } },
      payment: true,
    },
  });

  if (!booking) return null;

  return {
    ...booking,
    trip: booking.trip
      ? {
          ...booking.trip,
          images: JSON.parse(booking.trip.images),
          highlights: JSON.parse(booking.trip.highlights),
        }
      : undefined,
  };
}
