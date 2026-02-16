"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trip } from "@/types";
import { Clock, Users, ArrowRight, TrendingUp, Gift } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface TripRecommendationProps {
  currentTrip: Trip;
  allTrips: Trip[];
}

export function TripRecommendation({ currentTrip, allTrips }: TripRecommendationProps) {
  // Get similar trips (exclude current trip)
  const similarTrips = allTrips
    .filter((trip) => trip.id !== currentTrip.id)
    .filter((trip) => {
      // Similar based on duration or price range
      const durationDiff = Math.abs(parseInt(trip.duration) - parseInt(currentTrip.duration));
      const priceDiff = Math.abs(trip.basePrice - currentTrip.basePrice);

      return durationDiff <= 2 || priceDiff <= currentTrip.basePrice * 0.5;
    })
    .slice(0, 3);

  // Calculate multi-trip discount
  const multiTripDiscount = currentTrip.basePrice * 0.1; // 10% off

  if (similarTrips.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Cross-sell Header */}
      <div className="text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          You Might Also Like
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Complete your Amvrakikos experience with these complementary fishing trips
        </p>
      </div>

      {/* Multi-trip Discount Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Book Multiple Trips & Save</h3>
            <p className="text-white/90 text-sm mb-3">
              Book another trip with us and get 10% off your combined booking
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Save up to {formatPrice(multiTripDiscount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarTrips.map((trip, index) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                {/* Badges */}
                <div className="flex gap-2 mb-3">
                  {trip.isPremium && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                      Best Choice
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    Different Experience
                  </Badge>
                </div>

                {/* Trip Info */}
                <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                  {trip.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trip.duration}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {trip.maxParticipants}
                  </span>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                  {trip.description}
                </p>

                {/* Comparison highlights */}
                <div className="space-y-2 mb-4">
                  {trip.highlights.slice(0, 2).map((highlight, i) => (
                    <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-teal-600 mt-0.5">✓</span>
                      <span className="line-clamp-1">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-xs text-slate-500">From</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {formatPrice(trip.basePrice)}
                    </p>
                  </div>
                  <Link href={`/booking?trip=${trip.id}`}>
                    <Button size="sm" className="bg-blue-900 hover:bg-blue-800">
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/trips">
          <Button variant="outline" size="lg" className="gap-2">
            View All Trips
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
