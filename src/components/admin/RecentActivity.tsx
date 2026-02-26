import { formatPrice } from "@/lib/utils";
import { CalendarCheck, Star, CreditCard } from "lucide-react";
import Link from "next/link";

interface RecentActivityProps {
  data: {
    recentBookings: Array<{
      id: string;
      contactName: string;
      contactEmail: string;
      totalPrice: number;
      status: string;
      createdAt: Date;
      trip: { name: string } | null;
    }>;
    recentReviews: Array<{
      id: string;
      userName: string;
      rating: number;
      comment: string;
      isVerified: boolean;
      createdAt: Date;
      trip: { name: string } | null;
    }>;
    recentPayments: Array<{
      id: string;
      amount: number;
      status: string;
      createdAt: Date;
      booking: {
        contactName: string;
        trip: { name: string } | null;
      } | null;
    }>;
  };
  locale: string;
}

export function RecentActivity({ data, locale }: RecentActivityProps) {
  const { recentBookings, recentReviews, recentPayments } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarCheck className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold">Recent Bookings</h3>
        </div>
        <div className="space-y-3">
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet</p>
          ) : (
            recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{booking.contactName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {booking.trip?.name || "Unknown trip"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{formatPrice(booking.totalPrice)}</p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      booking.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : booking.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-700"
                        : booking.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <Link
          href={`/${locale}/admin/bookings`}
          className="block mt-4 text-xs text-blue-600 hover:underline"
        >
          View all bookings →
        </Link>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-green-600" />
          <h3 className="font-semibold">Recent Payments</h3>
        </div>
        <div className="space-y-3">
          {recentPayments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payments yet</p>
          ) : (
            recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {payment.booking?.contactName || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {payment.booking?.trip?.name || "Unknown trip"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{formatPrice(payment.amount)}</p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      payment.status === "succeeded"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-yellow-500" />
          <h3 className="font-semibold">Recent Reviews</h3>
        </div>
        <div className="space-y-3">
          {recentReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet</p>
          ) : (
            recentReviews.map((review) => (
              <div key={review.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{review.userName}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{review.comment}</p>
                {!review.isVerified && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                    Pending
                  </span>
                )}
              </div>
            ))
          )}
        </div>
        <Link
          href={`/${locale}/admin/reviews`}
          className="block mt-4 text-xs text-blue-600 hover:underline"
        >
          Manage reviews →
        </Link>
      </div>
    </div>
  );
}
