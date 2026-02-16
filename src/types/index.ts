export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED' | 'COMPLETED';
export type AddOnCategory = 'GENERAL' | 'FOOD' | 'TRANSPORT' | 'EQUIPMENT' | 'PHOTO' | 'PREMIUM';

export interface Trip {
  id: string;
  name: string;
  description: string;
  duration: string;
  basePrice: number;
  maxParticipants: number;
  images: string[];
  highlights: string[];
  isPremium: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  tripId: string;
  trip?: Trip;
  date: Date;
  participants: number;
  totalPrice: number;
  status: BookingStatus;
  contactEmail: string;
  contactPhone: string;
  contactName: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  bookingAddOns?: BookingAddOn[];
  payment?: Payment;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: AddOnCategory;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingAddOn {
  id: string;
  bookingId: string;
  addOnId: string;
  addOn?: AddOn;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  tripId: string;
  trip?: Trip;
  userName: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Voucher {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  stripePaymentId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: 'catches' | 'boat' | 'scenery' | 'guests';
  isActive: boolean;
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: Date;
}

export interface Availability {
  id: string;
  tripId: string;
  trip?: Trip;
  date: Date;
  availableSpots: number;
}
