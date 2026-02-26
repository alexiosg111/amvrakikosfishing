"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Review, Trip } from "@/types";
import { Star, CheckCircle2, Filter } from "lucide-react";

interface TestimonialsListProps {
  initialReviews: Review[];
  trips: Trip[];
  initialTripId?: string;
  initialRating?: number;
}

export function TestimonialsList({
  initialReviews,
  trips,
  initialTripId,
  initialRating,
}: TestimonialsListProps) {
  const t = useTranslations();
  const [selectedTripId, setSelectedTripId] = useState(initialTripId || 'all');
  const [selectedRating, setSelectedRating] = useState<number | undefined>(initialRating);
  const [reviews, setReviews] = useState(initialReviews);

  const filterReviews = (tripId: string, rating?: number) => {
    let filtered = initialReviews;

    if (tripId && tripId !== 'all') {
      filtered = filtered.filter(review => review.tripId === tripId);
    }

    if (rating && rating > 0) {
      filtered = filtered.filter(review => review.rating === rating);
    }

    setReviews(filtered);
  };

  const handleTripChange = (tripId: string) => {
    setSelectedTripId(tripId);
    filterReviews(tripId, selectedRating);
  };

  const handleRatingChange = (rating: string) => {
    const ratingValue = rating === 'all' ? undefined : parseInt(rating);
    setSelectedRating(ratingValue);
    filterReviews(selectedTripId, ratingValue);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
        }`}
      />
    ));
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-slate-50 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">{t("testimonials.filterAll")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trip filter */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              {t("testimonials.filterTrip")}
            </label>
            <Select value={selectedTripId} onValueChange={handleTripChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("testimonials.allTrips")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("testimonials.allTrips")}</SelectItem>
                {trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating filter */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              {t("testimonials.filterRating")}
            </label>
            <Select value={selectedRating?.toString() || 'all'} onValueChange={handleRatingChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("testimonials.allRatings")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("testimonials.allRatings")}</SelectItem>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span>{t(`testimonials.${rating}stars`)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reviews grid */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{review.userName}</h3>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {t("testimonials.verified")}
                        </Badge>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  {review.trip && (
                    <Badge variant="secondary" className="w-fit">
                      {review.trip.name}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                  <p className="text-sm text-slate-400 mt-4">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Star className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">{t("testimonials.noReviews")}</p>
        </div>
      )}
    </div>
  );
}
