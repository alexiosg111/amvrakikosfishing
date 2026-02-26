'use server';

import { prisma } from '@/lib/db';

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
  totalRevenue: number;
  monthRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
  activeTrips: number;
  totalReviews: number;
  upcomingTripsThisWeek: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface BookingTrendData {
  date: string;
  bookings: number;
  revenue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);

  const [
    totalBookings,
    todayBookings,
    weekBookings,
    monthBookings,
    allRevenue,
    monthRevenue,
    pendingBookings,
    confirmedBookings,
    activeTrips,
    totalReviews,
    upcomingBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.booking.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.booking.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.booking.aggregate({
      where: { status: { in: ['PAID', 'COMPLETED'] } },
      _sum: { totalPrice: true },
    }),
    prisma.booking.aggregate({
      where: { status: { in: ['PAID', 'COMPLETED'] }, createdAt: { gte: monthStart } },
      _sum: { totalPrice: true },
    }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.trip.count({ where: { isActive: true } }),
    prisma.review.count(),
    prisma.booking.count({
      where: {
        date: { gte: now, lte: weekEnd },
        status: { in: ['CONFIRMED', 'PAID'] },
      },
    }),
  ]);

  return {
    totalBookings,
    todayBookings,
    weekBookings,
    monthBookings,
    totalRevenue: allRevenue._sum.totalPrice || 0,
    monthRevenue: monthRevenue._sum.totalPrice || 0,
    pendingBookings,
    confirmedBookings,
    activeTrips,
    totalReviews,
    upcomingTripsThisWeek: upcomingBookings,
  };
}

export async function getRevenueAnalytics(months = 12): Promise<RevenueData[]> {
  const results: RevenueData[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const [revenue, bookingCount] = await Promise.all([
      prisma.booking.aggregate({
        where: {
          status: { in: ['PAID', 'COMPLETED'] },
          createdAt: { gte: start, lte: end },
        },
        _sum: { totalPrice: true },
      }),
      prisma.booking.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
    ]);

    results.push({
      month: start.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      revenue: revenue._sum.totalPrice || 0,
      bookings: bookingCount,
    });
  }

  return results;
}

export async function getBookingTrends(days = 30): Promise<BookingTrendData[]> {
  const results: BookingTrendData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const [bookingCount, revenue] = await Promise.all([
      prisma.booking.count({
        where: { createdAt: { gte: dayStart, lt: dayEnd } },
      }),
      prisma.booking.aggregate({
        where: {
          status: { in: ['PAID', 'COMPLETED'] },
          createdAt: { gte: dayStart, lt: dayEnd },
        },
        _sum: { totalPrice: true },
      }),
    ]);

    results.push({
      date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bookings: bookingCount,
      revenue: revenue._sum.totalPrice || 0,
    });
  }

  return results;
}

export async function getRecentActivity() {
  const [recentBookings, recentReviews, recentPayments] = await Promise.all([
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { trip: true },
    }),
    prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { trip: true },
    }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { booking: { include: { trip: true } } },
    }),
  ]);

  return { recentBookings, recentReviews, recentPayments };
}

export async function getBookingsByStatus() {
  const statuses = ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'COMPLETED'] as const;
  const results = await Promise.all(
    statuses.map(async (status) => ({
      status,
      count: await prisma.booking.count({ where: { status } }),
    }))
  );
  return results;
}

export async function getTripAnalytics() {
  const trips = await prisma.trip.findMany({
    include: {
      bookings: true,
      reviews: true,
    },
  });

  return trips.map((trip) => ({
    id: trip.id,
    name: trip.name,
    bookingCount: trip.bookings.length,
    revenue: trip.bookings
      .filter((b) => ['PAID', 'COMPLETED'].includes(b.status))
      .reduce((sum, b) => sum + b.totalPrice, 0),
    averageRating:
      trip.reviews.length > 0
        ? trip.reviews.reduce((sum, r) => sum + r.rating, 0) / trip.reviews.length
        : 0,
    reviewCount: trip.reviews.length,
  }));
}

export async function getTopCustomers(limit = 10) {
  const bookings = await prisma.booking.groupBy({
    by: ['contactEmail', 'contactName'],
    _sum: { totalPrice: true },
    _count: { id: true },
    orderBy: { _sum: { totalPrice: 'desc' } },
    take: limit,
  });

  return bookings.map((b) => ({
    email: b.contactEmail,
    name: b.contactName,
    totalSpent: b._sum.totalPrice || 0,
    bookingCount: b._count.id,
  }));
}
