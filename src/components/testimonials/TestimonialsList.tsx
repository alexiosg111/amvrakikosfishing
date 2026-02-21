"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Review } from "@/types";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface TestimonialsListProps {
  reviews: Review[];
}

const pageSize = 6;

export function TestimonialsList({ reviews }: TestimonialsListProps) {
  const t = useTranslations("testimonials");
  const [selectedTrip, setSelectedTrip] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const trips = useMemo(() => {
    const tripMap = new Map<string, { id: string; name: string }>();
    reviews.forEach((review) => {
      if (review.trip) {
        tripMap.set(review.trip.id, { id: review.trip.id, name: review.trip.name });
      }
    });
    return Array.from(tripMap.values());
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesTrip = selectedTrip === "all" || review.tripId === selectedTrip;
      const matchesRating =
        selectedRating === "all" || review.rating === Number(selectedRating);
      return matchesTrip && matchesRating;
    });
  }, [reviews, selectedTrip, selectedRating]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const canLoadMore = visibleCount < filteredReviews.length;

  return (
    <section className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
          <Select
            value={selectedTrip}
            onValueChange={(value) => {
              setSelectedTrip(value);
              setVisibleCount(pageSize);
            }}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder={t("filters.tripPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allTrips")}</SelectItem>
              {trips.map((trip) => (
                <SelectItem key={trip.id} value={trip.id}>
                  {trip.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedRating}
            onValueChange={(value) => {
              setSelectedRating(value);
              setVisibleCount(pageSize);
            }}
          >
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder={t("filters.ratingPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allRatings")}</SelectItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <SelectItem key={rating} value={String(rating)}>
                  {t("filters.stars", { rating })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            {t("empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleReviews.map((review) => (
              <Card key={review.id} className="p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        {review.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-900">{review.userName}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {review.trip && (
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                      {review.trip.name}
                    </span>
                  )}
                </div>

                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-slate-700">{review.comment}</p>

                {review.isVerified && (
                  <p className="text-xs text-blue-600 font-medium">
                    {t("verified")}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}

        {canLoadMore && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((count) => count + pageSize)}
            >
              {t("loadMore")}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
