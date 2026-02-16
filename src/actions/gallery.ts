'use server';

import { prisma } from '@/lib/db';
import { GalleryImage } from '@/types';

export async function getGalleryImages(category?: string, search?: string): Promise<GalleryImage[]> {
  const where: {
    isActive: boolean;
    category?: string;
    OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>;
  } = { isActive: true };
  
  if (category && category !== 'all') {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
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
