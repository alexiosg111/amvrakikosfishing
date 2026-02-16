"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Check, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types";
import { formatPrice } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const imageUrl = trip.images[0] || "https://placehold.co/600x400/1a365d/white?text=Fishing+Trip";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={imageUrl}
            alt={trip.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {trip.isPremium && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {t("trips.bestChoice")}
              </Badge>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-slate-900">
              {formatPrice(trip.basePrice)}
            </Badge>
          </div>
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

          <div className="space-y-2">
            {trip.highlights.slice(0, 3).map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span className="line-clamp-1">{highlight}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 gap-3">
          <Link href={`/${locale}/trips/${trip.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              {t("trips.learnMore")}
            </Button>
          </Link>
          <Link href={`/${locale}/booking?trip=${trip.id}`} className="flex-1">
            <Button className="w-full bg-blue-900 hover:bg-blue-800">
              {t("trips.bookNow")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
