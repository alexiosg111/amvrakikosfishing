"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { getBookingByEmail } from "@/actions/bookings";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Search, Calendar, Users, Fish, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-slate-100 text-slate-700",
};

export default function MyBookingsPage() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const data = await getBookingByEmail(email.trim());
      setBookings(data);
      setSearched(true);
    } catch {
      toast.error("Failed to lookup bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            My Bookings
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Enter your email address to view all your fishing trip bookings.
          </p>
        </motion.div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="bg-blue-900 hover:bg-blue-800 px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Find
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AnimatePresence>
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Fish className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">No bookings found</p>
                  <p className="text-slate-400 text-sm mt-1">
                    No bookings were found for {email}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-600 font-medium">
                    Found {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                  </p>
                  {bookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">
                                Booking #{booking.id.slice(-8).toUpperCase()}
                              </p>
                              <h3 className="font-semibold text-slate-900 text-lg">
                                {booking.trip?.name}
                              </h3>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                statusColors[booking.status] || ""
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>
                                {new Date(booking.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span>{booking.participants} guests</span>
                            </div>
                            <div className="text-sm font-semibold text-blue-900 text-right">
                              {formatPrice(booking.totalPrice)}
                            </div>
                          </div>

                          {booking.bookingAddOns && booking.bookingAddOns.length > 0 && (
                            <div className="pt-3 border-t border-slate-100">
                              <p className="text-xs text-slate-500 mb-2">Add-ons:</p>
                              <div className="flex flex-wrap gap-1">
                                {booking.bookingAddOns.map((addon) => (
                                  <Badge
                                    key={addon.id}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {addon.addOn?.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {booking.status === "PENDING" && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                              Your booking is pending. We&apos;ll confirm it shortly or you can complete payment online.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
