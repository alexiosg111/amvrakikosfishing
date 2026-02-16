'use server';

import { prisma } from '@/lib/db';
import { Booking, ContactMessage, Trip, AddOn } from '@/types';
import { revalidatePath } from 'next/cache';
import { sendBookingConfirmation } from '@/lib/email';

export async function getDashboardStats() {
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    paidBookings,
    totalRevenue,
    unreadMessages,
    upcomingTrips,
    recentReviews,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { status: 'PAID' } }),
    prisma.booking.aggregate({
      where: { status: 'PAID' },
      _sum: { totalPrice: true },
    }),
    prisma.contactMessage.count({ where: { status: 'unread' } }),
    prisma.booking.count({
      where: {
        date: { gte: new Date() },
        status: { in: ['CONFIRMED', 'PAID'] },
      },
    }),
    prisma.review.count({ where: { isVerified: false } }),
  ]);

  // Get monthly revenue data for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await prisma.booking.groupBy({
    by: ['createdAt'],
    where: {
      status: 'PAID',
      createdAt: { gte: sixMonthsAgo },
    },
    _sum: { totalPrice: true },
  });

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    paidBookings,
    totalRevenue: totalRevenue._sum.totalPrice || 0,
    unreadMessages,
    upcomingTrips,
    recentReviews,
    monthlyRevenue,
  };
}

export async function getRecentBookings(limit: number = 10): Promise<Booking[]> {
  const bookings = await prisma.booking.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      trip: true,
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
      payment: true,
    },
  });

  return bookings.map(booking => ({
    ...booking,
    bookingAddOns: booking.bookingAddOns.map(ba => ({
      ...ba,
      addOn: ba.addOn ? {
        ...ba.addOn,
        price: ba.price,
      } : undefined,
    })),
  }));
}

export async function getAllBookings(): Promise<Booking[]> {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      trip: true,
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
      payment: true,
    },
  });

  return bookings.map(booking => ({
    ...booking,
    bookingAddOns: booking.bookingAddOns.map(ba => ({
      ...ba,
      addOn: ba.addOn ? {
        ...ba.addOn,
        price: ba.price,
      } : undefined,
    })),
  }));
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateContactMessageStatus(id: string, status: string): Promise<ContactMessage> {
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin');
  return message;
}

export async function confirmBooking(id: string): Promise<Booking> {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: 'CONFIRMED' },
    include: {
      trip: true,
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
    },
  });

  // Send confirmation email
  try {
    await sendBookingConfirmation({
      to: booking.contactEmail,
      bookingId: booking.id,
      tripName: booking.trip.name,
      date: booking.date,
      participants: booking.participants,
      totalPrice: booking.totalPrice,
      name: booking.contactName,
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }

  revalidatePath('/admin');

  return {
    ...booking,
    bookingAddOns: booking.bookingAddOns.map(ba => ({
      ...ba,
      addOn: ba.addOn ? {
        ...ba.addOn,
        price: ba.price,
      } : undefined,
    })),
  };
}

export async function cancelBooking(id: string): Promise<Booking> {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: {
      trip: true,
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
    },
  });

  // Restore availability
  const availability = await prisma.availability.findUnique({
    where: {
      tripId_date: {
        tripId: booking.tripId,
        date: booking.date,
      },
    },
  });

  if (availability) {
    await prisma.availability.update({
      where: { id: availability.id },
      data: { availableSpots: availability.availableSpots + booking.participants },
    });
  }

  revalidatePath('/admin');

  return {
    ...booking,
    bookingAddOns: booking.bookingAddOns.map(ba => ({
      ...ba,
      addOn: ba.addOn ? {
        ...ba.addOn,
        price: ba.price,
      } : undefined,
    })),
  };
}

export async function getUpcomingTrips(): Promise<Booking[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookings = await prisma.booking.findMany({
    where: {
      date: { gte: today },
      status: { in: ['CONFIRMED', 'PAID'] },
    },
    orderBy: { date: 'asc' },
    include: {
      trip: true,
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
    },
  });

  return bookings.map(booking => ({
    ...booking,
    bookingAddOns: booking.bookingAddOns.map(ba => ({
      ...ba,
      addOn: ba.addOn ? {
        ...ba.addOn,
        price: ba.price,
      } : undefined,
    })),
  }));
}

// Trip management
export async function createTrip(data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
  const trip = await prisma.trip.create({
    data: {
      ...data,
      images: JSON.stringify(data.images),
      highlights: JSON.stringify(data.highlights),
    },
  });

  revalidatePath('/trips');
  revalidatePath('/admin');

  return {
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  };
}

export async function updateTrip(id: string, data: Partial<Trip>): Promise<Trip> {
  const trip = await prisma.trip.update({
    where: { id },
    data: {
      ...data,
      images: data.images ? JSON.stringify(data.images) : undefined,
      highlights: data.highlights ? JSON.stringify(data.highlights) : undefined,
    },
  });

  revalidatePath('/trips');
  revalidatePath('/admin');

  return {
    ...trip,
    images: JSON.parse(trip.images),
    highlights: JSON.parse(trip.highlights),
  };
}

export async function deleteTrip(id: string): Promise<void> {
  await prisma.trip.delete({
    where: { id },
  });

  revalidatePath('/trips');
  revalidatePath('/admin');
}

// AddOn management
export async function createAddOn(data: Omit<AddOn, 'id' | 'createdAt' | 'updatedAt'>): Promise<AddOn> {
  const addOn = await prisma.addOn.create({
    data,
  });

  revalidatePath('/booking');
  revalidatePath('/admin');

  return addOn;
}

export async function updateAddOn(id: string, data: Partial<AddOn>): Promise<AddOn> {
  const addOn = await prisma.addOn.update({
    where: { id },
    data,
  });

  revalidatePath('/booking');
  revalidatePath('/admin');

  return addOn;
}

export async function deleteAddOn(id: string): Promise<void> {
  await prisma.addOn.delete({
    where: { id },
  });

  revalidatePath('/booking');
  revalidatePath('/admin');
}
