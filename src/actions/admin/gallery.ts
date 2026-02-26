'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { GalleryImage } from '@/types';

export interface GalleryImageFormData {
  title: string;
  description?: string;
  imageUrl: string;
  category: 'catches' | 'boat' | 'scenery' | 'guests';
  isActive: boolean;
}

export interface GalleryFilters {
  category?: string;
  isActive?: boolean;
}

export async function getAllGalleryImages(filters: GalleryFilters = {}): Promise<GalleryImage[]> {
  const { category, isActive } = filters;

  const where: Record<string, unknown> = {};

  if (category && category !== 'all') {
    where.category = category;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  return await prisma.galleryImage.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createGalleryImage(data: GalleryImageFormData): Promise<GalleryImage> {
  const image = await prisma.galleryImage.create({ data });
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  return image;
}

export async function updateGalleryImage(
  id: string,
  data: GalleryImageFormData
): Promise<GalleryImage> {
  const image = await prisma.galleryImage.update({ where: { id }, data });
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  return image;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

export async function toggleGalleryImageStatus(
  id: string,
  isActive: boolean
): Promise<GalleryImage> {
  const image = await prisma.galleryImage.update({ where: { id }, data: { isActive } });
  revalidatePath('/admin/gallery');
  return image;
}
