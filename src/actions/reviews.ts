'use server';

import { prisma } from '@/lib/db';
import { ReviewFormData } from '@/lib/validations';
import { Review } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createReview(data: ReviewFormData): Promise<Review> {
  const review = await prisma.review.create({
    data: {
      tripId: data.tripId,
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      isVerified: false, // Requires manual verification
    },
  });

  revalidatePath('/testimonials');
  revalidatePath(`/trips/${data.tripId}`);

  return review;
}

export async function getReviews(tripId?: string, rating?: number): Promise<Review[]> {
  const where: { isVerified: boolean; tripId?: string; rating?: number } = { isVerified: true };

  if (tripId && tripId !== 'all') {
    where.tripId = tripId;
  }

  if (rating && rating > 0) {
    where.rating = rating;
  }

  return await prisma.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      trip: true,
    },
  });
}

export async function getReviewsByTrip(tripId: string): Promise<Review[]> {
  return await prisma.review.findMany({
    where: { tripId, isVerified: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAverageRating(tripId: string): Promise<{ average: number; count: number }> {
  const result = await prisma.review.aggregate({
    where: { tripId, isVerified: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    average: result._avg.rating || 0,
    count: result._count.rating,
  };
}
