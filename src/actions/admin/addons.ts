'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { AddOn, AddOnCategory } from '@/types';

export interface AddOnFormData {
  name: string;
  description: string;
  price: number;
  category: AddOnCategory;
  isActive: boolean;
  imageUrl?: string;
}

export interface AddOnFilters {
  search?: string;
  category?: AddOnCategory | 'ALL';
  isActive?: boolean;
}

export async function getAllAddOns(filters: AddOnFilters = {}): Promise<AddOn[]> {
  const { search, category, isActive } = filters;

  const where: Record<string, unknown> = {};

  if (search) {
    where.name = { contains: search };
  }

  if (category && category !== 'ALL') {
    where.category = category;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  return await prisma.addOn.findMany({
    where,
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });
}

export async function createAddOn(data: AddOnFormData): Promise<AddOn> {
  const addOn = await prisma.addOn.create({ data });
  revalidatePath('/admin/addons');
  revalidatePath('/booking');
  return addOn;
}

export async function updateAddOn(id: string, data: AddOnFormData): Promise<AddOn> {
  const addOn = await prisma.addOn.update({ where: { id }, data });
  revalidatePath('/admin/addons');
  revalidatePath('/booking');
  return addOn;
}

export async function deleteAddOn(id: string): Promise<void> {
  await prisma.addOn.delete({ where: { id } });
  revalidatePath('/admin/addons');
}

export async function toggleAddOnStatus(id: string, isActive: boolean): Promise<AddOn> {
  const addOn = await prisma.addOn.update({ where: { id }, data: { isActive } });
  revalidatePath('/admin/addons');
  return addOn;
}
