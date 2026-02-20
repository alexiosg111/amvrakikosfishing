'use server';

import { prisma } from '@/lib/db';
import { BookingFormData } from '@/lib/validations';
import { Booking, AddOn } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createBooking(data: BookingFormData): Promise<Booking> {
  // Calculate total price
  const trip = await prisma.trip.findUnique({
    where: { id: data.tripId },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  let totalPrice = trip.basePrice * data.participants;

  // Add add-ons to total price
  if (data.addOns && data.addOns.length > 0) {
    for (const item of data.addOns) {
      const addOn = await prisma.addOn.findUnique({
        where: { id: item.addOnId, isActive: true },
      });
      if (addOn) {
        totalPrice += addOn.price * item.quantity;
      }
    }
  }

  // Apply voucher if provided
  if (data.voucherCode) {
    const voucher = await prisma.voucher.findUnique({
      where: { code: data.voucherCode.toUpperCase(), isActive: true },
    });

    if (voucher && totalPrice >= voucher.minPurchase) {
      if (voucher.maxUses === -1 || voucher.usedCount < voucher.maxUses) {
        if (!voucher.expiresAt || voucher.expiresAt > new Date()) {
          if (voucher.discountType === 'PERCENTAGE') {
            totalPrice = Math.round(totalPrice * (1 - voucher.discountValue / 100));
          } else {
            totalPrice = Math.max(0, totalPrice - voucher.discountValue);
          }

          // Increment voucher usage
          await prisma.voucher.update({
            where: { id: voucher.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }
  }

  // Create the booking
  const booking = await prisma.booking.create({
    data: {
      tripId: data.tripId,
      date: data.date,
      participants: data.participants,
      totalPrice,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      contactName: data.contactName,
      notes: data.notes,
      bookingAddOns: data.addOns ? {
        create: await Promise.all(data.addOns.map(async (item) => {
          const addOn = await prisma.addOn.findUnique({
            where: { id: item.addOnId },
          });
          return {
            addOnId: item.addOnId,
            quantity: item.quantity,
            price: addOn?.price || 0,
          };
        })),
      } : undefined,
    },
    include: {
      trip: true,
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
    },
  });

  // Update availability
  const availability = await prisma.availability.findUnique({
    where: {
      tripId_date: {
        tripId: data.tripId,
        date: data.date,
      },
    },
  });

  if (availability) {
    await prisma.availability.update({
      where: { id: availability.id },
      data: { availableSpots: Math.max(0, availability.availableSpots - data.participants) },
    });
  } else {
    await prisma.availability.create({
      data: {
        tripId: data.tripId,
        date: data.date,
        availableSpots: trip.maxParticipants - data.participants,
      },
    });
  }

  revalidatePath('/trips');
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

export async function getBookingById(id: string): Promise<Booking | null> {
  const booking = await prisma.booking.findUnique({
    where: { id },
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

  if (!booking) return null;

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

export async function updateBookingStatus(id: string, status: string): Promise<Booking> {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: status as any },
    include: {
      trip: true,
      bookingAddOns: {
        include: {
          addOn: true,
        },
      },
    },
  });

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

export async function getAddOns(): Promise<AddOn[]> {
  return await prisma.addOn.findMany({
    where: { isActive: true },
    orderBy: { category: 'asc' },
  });
}

export async function getBookingByEmail(email: string): Promise<Booking[]> {
  const bookings = await prisma.booking.findMany({
    where: { contactEmail: email },
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

export async function validateVoucher(code: string, purchaseAmount: number): Promise<{ valid: boolean; discount: number; message: string }> {
  const voucher = await prisma.voucher.findUnique({
    where: { code: code.toUpperCase(), isActive: true },
  });

  if (!voucher) {
    return { valid: false, discount: 0, message: 'Invalid voucher code' };
  }

  if (voucher.expiresAt && voucher.expiresAt < new Date()) {
    return { valid: false, discount: 0, message: 'Voucher has expired' };
  }

  if (voucher.maxUses !== -1 && voucher.usedCount >= voucher.maxUses) {
    return { valid: false, discount: 0, message: 'Voucher has reached maximum uses' };
  }

  if (purchaseAmount < voucher.minPurchase) {
    return { valid: false, discount: 0, message: `Minimum purchase of €${voucher.minPurchase} required` };
  }

  let discount = 0;
  if (voucher.discountType === 'PERCENTAGE') {
    discount = Math.round(purchaseAmount * (voucher.discountValue / 100));
  } else {
    discount = Math.min(voucher.discountValue, purchaseAmount);
  }

  return { valid: true, discount, message: `Voucher applied! You save €${discount}` };
}
