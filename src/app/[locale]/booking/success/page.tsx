"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Calendar, Users, Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBookingById } from "@/actions/bookings";
import { Booking } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      if (bookingId) {
        const data = await getBookingById(bookingId);
        setBooking(data);
      }
      setIsLoading(false);
    }
    loadBooking();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-slate-600 mb-8 text-lg">
            Thank you for booking with Amvrakikos Fishing Trips. We&apos;ll contact you shortly with more details.
          </p>

          {booking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-50 rounded-2xl p-6 mb-8 text-left"
            >
              <h2 className="font-semibold text-lg text-slate-900 mb-4">
                Booking Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Fish className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">Trip</p>
                    <p className="font-medium text-slate-900">{booking.trip?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-medium text-slate-900">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">Participants</p>
                    <p className="font-medium text-slate-900">{booking.participants}</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between">
                  <span className="font-semibold text-slate-900">Total Paid</span>
                  <span className="font-bold text-blue-900 text-lg">
                    {formatPrice(booking.totalPrice)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trips">
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50 px-8">
                Browse More Trips
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-blue-900 hover:bg-blue-800 px-8">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
