import { z } from 'zod';

export const bookingSchema = z.object({
  tripId: z.string().min(1, 'Trip is required'),
  date: z.date({ error: 'Date is required' }),
  participants: z.number().min(1, 'At least 1 participant is required').max(10, 'Maximum 10 participants'),
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  notes: z.string().optional(),
  addOns: z.array(z.object({
    addOnId: z.string(),
    quantity: z.number().min(1),
  })).optional(),
  voucherCode: z.string().optional(),
  locale: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const voucherSchema = z.object({
  code: z.string().min(3, 'Voucher code is required'),
});

export type VoucherFormData = z.infer<typeof voucherSchema>;

export const reviewSchema = z.object({
  tripId: z.string().min(1, 'Trip is required'),
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
