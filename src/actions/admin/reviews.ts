'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface ReviewFilters {
  search?: string;
  isVerified?: boolean;
  rating?: number;
  tripId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export async function getAllReviews(filters: ReviewFilters = {}) {
  const {
    search,
    isVerified,
    rating,
    tripId,
    page = 1,
    pageSize = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { userName: { contains: search } },
      { comment: { contains: search } },
    ];
  }

  if (isVerified !== undefined) {
    where.isVerified = isVerified;
  }

  if (rating) {
    where.rating = rating;
  }

  if (tripId) {
    where.tripId = tripId;
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { trip: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews: reviews.map((r) => ({
      ...r,
      trip: r.trip
        ? {
            ...r.trip,
            images: JSON.parse(r.trip.images),
            highlights: JSON.parse(r.trip.highlights),
          }
        : undefined,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function verifyReview(id: string, isVerified: boolean) {
  const review = await prisma.review.update({
    where: { id },
    data: { isVerified },
  });

  revalidatePath('/admin/reviews');
  revalidatePath('/testimonials');

  return review;
}

export async function deleteReview(id: string) {
  await prisma.review.delete({ where: { id } });
  revalidatePath('/admin/reviews');
  revalidatePath('/testimonials');
}

export async function getReviewStats() {
  const [total, verified, unverified, avgRating, byRating] = await Promise.all([
    prisma.review.count(),
    prisma.review.count({ where: { isVerified: true } }),
    prisma.review.count({ where: { isVerified: false } }),
    prisma.review.aggregate({ _avg: { rating: true } }),
    Promise.all(
      [1, 2, 3, 4, 5].map(async (r) => ({
        rating: r,
        count: await prisma.review.count({ where: { rating: r } }),
      }))
    ),
  ]);

  return {
    total,
    verified,
    unverified,
    averageRating: avgRating._avg.rating || 0,
    byRating,
  };
}
