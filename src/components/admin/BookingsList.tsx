"use client";

import { useState } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { adminUpdateBookingStatus } from "@/actions/admin/bookings";
import { toast } from "sonner";
import { Eye, CheckCircle, XCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { BookingStatus } from "@/types";

interface Booking {
  id: string;
  contactName: string;
  contactEmail: string;
  totalPrice: number;
  status: string;
  date: Date;
  participants: number;
  createdAt: Date;
  trip: { name: string } | null;
}

interface BookingsListProps {
  bookings: Booking[];
  locale: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  PAID: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  COMPLETED: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

export function BookingsList({ bookings, locale }: BookingsListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: BookingStatus) => {
    setLoading(id);
    try {
      await adminUpdateBookingStatus(id, status);
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch {
      toast.error("Failed to update booking status");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Trip</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Participants</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{booking.contactName}</p>
                    <p className="text-xs text-muted-foreground">{booking.contactEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {booking.trip?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(new Date(booking.date))}
                  </td>
                  <td className="px-4 py-3 text-center">{booking.participants}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(booking.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        statusColors[booking.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/${locale}/admin/bookings/${booking.id}`}>
                        <Button variant="ghost" size="icon-sm" title="View details">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      {booking.status === "PENDING" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Confirm"
                          disabled={loading === booking.id}
                          onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                        </Button>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Mark as Paid"
                          disabled={loading === booking.id}
                          onClick={() => handleStatusUpdate(booking.id, "PAID")}
                        >
                          <CreditCard className="w-3.5 h-3.5 text-green-600" />
                        </Button>
                      )}
                      {!["CANCELLED", "COMPLETED"].includes(booking.status) && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Cancel"
                          disabled={loading === booking.id}
                          onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
