'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Voucher } from '@/types';

export interface VoucherFormData {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxUses: number;
  expiresAt?: Date | null;
  isActive: boolean;
}

export interface VoucherFilters {
  search?: string;
  discountType?: 'PERCENTAGE' | 'FIXED' | 'ALL';
  isActive?: boolean;
}

export async function getAllVouchers(filters: VoucherFilters = {}): Promise<Voucher[]> {
  const { search, discountType, isActive } = filters;

  const where: Record<string, unknown> = {};

  if (search) {
    where.code = { contains: search.toUpperCase() };
  }

  if (discountType && discountType !== 'ALL') {
    where.discountType = discountType;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  return await prisma.voucher.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createVoucher(data: VoucherFormData): Promise<Voucher> {
  const voucher = await prisma.voucher.create({
    data: {
      ...data,
      code: data.code.toUpperCase(),
    },
  });
  revalidatePath('/admin/vouchers');
  return voucher;
}

export async function updateVoucher(id: string, data: VoucherFormData): Promise<Voucher> {
  const voucher = await prisma.voucher.update({
    where: { id },
    data: {
      ...data,
      code: data.code.toUpperCase(),
    },
  });
  revalidatePath('/admin/vouchers');
  return voucher;
}

export async function deleteVoucher(id: string): Promise<void> {
  await prisma.voucher.delete({ where: { id } });
  revalidatePath('/admin/vouchers');
}

export async function toggleVoucherStatus(id: string, isActive: boolean): Promise<Voucher> {
  const voucher = await prisma.voucher.update({ where: { id }, data: { isActive } });
  revalidatePath('/admin/vouchers');
  return voucher;
}

export async function resetVoucherUsage(id: string): Promise<Voucher> {
  const voucher = await prisma.voucher.update({ where: { id }, data: { usedCount: 0 } });
  revalidatePath('/admin/vouchers');
  return voucher;
}

export async function getVoucherStats() {
  const vouchers = await prisma.voucher.findMany();

  const totalUsage = vouchers.reduce((sum, v) => sum + v.usedCount, 0);
  const activeVouchers = vouchers.filter((v) => v.isActive).length;
  const expiredVouchers = vouchers.filter(
    (v) => v.expiresAt && v.expiresAt < new Date()
  ).length;

  return {
    total: vouchers.length,
    active: activeVouchers,
    expired: expiredVouchers,
    totalUsage,
  };
}
