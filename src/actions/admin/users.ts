'use server';

import { prisma } from '@/lib/db';

export interface UserSummary {
  email: string;
  name: string;
  totalSpent: number;
  bookingCount: number;
  lastBookingDate: Date | null;
  bookings: {
    id: string;
    date: Date;
    status: string;
    totalPrice: number;
    tripName: string;
    createdAt: Date;
  }[];
}

export interface UserFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'totalSpent' | 'bookingCount' | 'lastBooking';
  sortOrder?: 'asc' | 'desc';
}

export async function getAllUsers(filters: UserFilters = {}) {
  const { search, page = 1, pageSize = 20 } = filters;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { contactName: { contains: search } },
      { contactEmail: { contains: search } },
    ];
  }

  const groupedBookings = await prisma.booking.groupBy({
    by: ['contactEmail', 'contactName'],
    where,
    _sum: { totalPrice: true },
    _count: { id: true },
    _max: { createdAt: true },
    orderBy: { _sum: { totalPrice: 'desc' } },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.booking.groupBy({
    by: ['contactEmail'],
    where,
  });

  const users = await Promise.all(
    groupedBookings.map(async (user) => {
      const bookings = await prisma.booking.findMany({
        where: { contactEmail: user.contactEmail },
        include: { trip: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      return {
        email: user.contactEmail,
        name: user.contactName,
        totalSpent: user._sum.totalPrice || 0,
        bookingCount: user._count.id,
        lastBookingDate: user._max.createdAt,
        bookings: bookings.map((b) => ({
          id: b.id,
          date: b.date,
          status: b.status,
          totalPrice: b.totalPrice,
          tripName: b.trip?.name || 'Unknown',
          createdAt: b.createdAt,
        })),
      };
    })
  );

  return {
    users,
    total: total.length,
    page,
    pageSize,
    totalPages: Math.ceil(total.length / pageSize),
  };
}

export async function getUserDetails(email: string): Promise<UserSummary | null> {
  const bookings = await prisma.booking.findMany({
    where: { contactEmail: email },
    include: { trip: true, payment: true },
    orderBy: { createdAt: 'desc' },
  });

  if (bookings.length === 0) return null;

  const totalSpent = bookings
    .filter((b) => ['PAID', 'COMPLETED'].includes(b.status))
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return {
    email,
    name: bookings[0].contactName,
    totalSpent,
    bookingCount: bookings.length,
    lastBookingDate: bookings[0].createdAt,
    bookings: bookings.map((b) => ({
      id: b.id,
      date: b.date,
      status: b.status,
      totalPrice: b.totalPrice,
      tripName: b.trip?.name || 'Unknown',
      createdAt: b.createdAt,
    })),
  };
}
