"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Check, Star, Flame, Crown, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types";
import { formatPrice } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  showSocialProof?: boolean;
  guestCount?: number;
}

export function TripCard({ trip, showSocialProof = true, guestCount }: TripCardProps) {
  const t = useTranslations();
  const imageUrl = trip.images[0] || "https://placehold.co/600x400/1a365d/white?text=Fishing+Trip";

  // Generate random guest count if not provided
  const displayGuestCount = guestCount || Math.floor(Math.random() * 50) + 20;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow relative">
        {/* Urgency Indicator */}
        {trip.isPremium && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs text-center py-1 z-10">
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-3 h-3" />
              <span>Limited availability this week</span>
            </div>
          </div>
        )}

        <div className="relative h-56 overflow-hidden">
          <Image
            src={imageUrl}
            alt={trip.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {trip.isPremium && (
            <div className="absolute top-10 left-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-3 py-1 shadow-md">
                <Crown className="w-3 h-3 mr-1" />
                {t("trips.bestChoice") || "Best Choice"}
              </Badge>
            </div>
          )}
          <div className="absolute top-10 right-4">
            <Badge variant="secondary" className="bg-white/90 text-slate-900 shadow-md">
              {formatPrice(trip.basePrice)}
            </Badge>
          </div>

          {/* Social Proof Overlay */}
          {showSocialProof && (
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
              <div className="flex items-center gap-1.5 text-xs">
                <Users2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-slate-900">
                  {displayGuestCount} guests this week
                </span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-6">
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {trip.duration} {t("common.hours")}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {t("trips.maxParticipants")}: {trip.maxParticipants}
            </span>
          </div>

          <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 line-clamp-2">
            {trip.name}
          </h3>

          <p className="text-slate-600 text-sm line-clamp-2 mb-4">
            {trip.description}
          </p>

          {/* Premium Perks */}
          {trip.isPremium && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Premium Perks Included
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-700 flex items-center gap-1">
                  <Check className="w-3 h-3 text-teal-600" />
                  <span>Premium equipment</span>
                </div>
                <div className="text-xs text-slate-700 flex items-center gap-1">
                  <Check className="w-3 h-3 text-teal-600" />
                  <span>Photo package included</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {trip.highlights.slice(0, trip.isPremium ? 2 : 3).map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span className="line-clamp-1">{highlight}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 gap-3">
          <Link href={`/trips/${trip.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              {t("trips.learnMore") || "Learn More"}
            </Button>
          </Link>
          <Link href={`/booking?trip=${trip.id}`} className="flex-1">
            <Button className="w-full bg-blue-900 hover:bg-blue-800">
              {t("trips.bookNow") || "Book Now"}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
