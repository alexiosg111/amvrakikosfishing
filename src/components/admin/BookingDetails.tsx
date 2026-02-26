"use client";

import { useState } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { adminUpdateBookingStatus, addBookingNote } from "@/actions/admin/bookings";
import { toast } from "sonner";
import { BookingStatus } from "@/types";
import { CheckCircle, XCircle, CreditCard, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BookingDetailsProps {
  booking: {
    id: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    totalPrice: number;
    status: string;
    date: Date;
    participants: number;
    notes?: string | null;
    createdAt: Date;
    trip: {
      id: string;
      name: string;
      duration: string;
      basePrice: number;
    } | null;
    bookingAddOns: Array<{
      id: string;
      quantity: number;
      price: number;
      addOn: { name: string; category: string } | null;
    }>;
    payment: {
      id: string;
      amount: number;
      status: string;
      stripePaymentId: string;
    } | null;
  };
  locale: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-slate-100 text-slate-700",
};

export function BookingDetails({ booking, locale }: BookingDetailsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState(booking.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  const handleStatusUpdate = async (status: BookingStatus) => {
    setLoading(status);
    try {
      await adminUpdateBookingStatus(booking.id, status);
      toast.success(`Booking status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(null);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await addBookingNote(booking.id, notes);
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/bookings`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Booking #{booking.id.slice(0, 8)}</h2>
          <p className="text-sm text-muted-foreground">
            Created {formatDate(new Date(booking.createdAt))}
          </p>
        </div>
        <span
          className={`ml-auto text-sm px-3 py-1 rounded-full font-medium ${
            statusColors[booking.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Customer Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{booking.contactName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{booking.contactEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{booking.contactPhone}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Trip Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trip</span>
              <span className="font-medium">{booking.trip?.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{formatDate(new Date(booking.date))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Participants</span>
              <span className="font-medium">{booking.participants}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{booking.trip?.duration || "—"}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Pricing & Add-Ons</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Price</span>
              <span>
                {booking.trip
                  ? formatPrice(booking.trip.basePrice * booking.participants)
                  : "—"}
              </span>
            </div>
            {booking.bookingAddOns.map((addOn) => (
              <div key={addOn.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {addOn.addOn?.name} × {addOn.quantity}
                </span>
                <span>{formatPrice(addOn.price * addOn.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(booking.totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Payment</h3>
          {booking.payment ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatPrice(booking.payment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{booking.payment.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stripe ID</span>
                <span className="font-mono text-xs truncate max-w-32">
                  {booking.payment.stripePaymentId}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment recorded</p>
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Notes
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add internal notes about this booking..."
          className="w-full min-h-24 rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button size="sm" onClick={handleSaveNotes} disabled={savingNotes}>
          {savingNotes ? "Saving..." : "Save Notes"}
        </Button>
      </div>

      <div className="bg-card rounded-xl border p-6 space-y-3">
        <h3 className="font-semibold">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {booking.status === "PENDING" && (
            <Button
              onClick={() => handleStatusUpdate("CONFIRMED")}
              disabled={loading === "CONFIRMED"}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm Booking
            </Button>
          )}
          {booking.status === "CONFIRMED" && (
            <Button
              onClick={() => handleStatusUpdate("PAID")}
              disabled={loading === "PAID"}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="w-4 h-4" />
              Mark as Paid
            </Button>
          )}
          {booking.status === "PAID" && (
            <Button
              onClick={() => handleStatusUpdate("COMPLETED")}
              disabled={loading === "COMPLETED"}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Completed
            </Button>
          )}
          {!["CANCELLED", "COMPLETED"].includes(booking.status) && (
            <Button
              variant="destructive"
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={loading === "CANCELLED"}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
