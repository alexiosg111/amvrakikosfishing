'use server';

import { prisma } from '@/lib/db';
import { GalleryImage } from '@/types';

interface GalleryFilters {
  category?: string;
}

export async function getGalleryImages(filters: GalleryFilters = {}): Promise<GalleryImage[]> {
  const { category } = filters;
  const where: { isActive: boolean; category?: string } = { isActive: true };

  if (category && category !== 'all') {
    where.category = category;
  }

  return await prisma.galleryImage.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getGalleryCategories(): Promise<string[]> {
  const categories = await prisma.galleryImage.findMany({
    where: { isActive: true },
    select: { category: true },
    distinct: ['category'],
  });

  return categories.map(c => c.category);
}
