"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Review, Trip } from "@/types";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestimonialsContentProps {
  reviews: Review[];
  trips: Trip[];
}

export function TestimonialsContent({ reviews, trips }: TestimonialsContentProps) {
  const t = useTranslations();
  const [selectedTrip, setSelectedTrip] = useState("all");
  const [sortOption, setSortOption] = useState("recent");

  const filteredReviews = useMemo(() => {
    const filtered = selectedTrip === "all"
      ? reviews
      : reviews.filter((review) => review.tripId === selectedTrip);

    return [...filtered].sort((a, b) => {
      if (sortOption === "rating") {
        return b.rating - a.rating;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reviews, selectedTrip, sortOption]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-56">
            <Select value={selectedTrip} onValueChange={setSelectedTrip}>
              <SelectTrigger>
                <SelectValue placeholder={t("testimonials.filterTrip")} />
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
          <div className="w-full sm:w-48">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder={t("testimonials.sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">{t("testimonials.sortRecent")}</SelectItem>
                <SelectItem value="rating">{t("testimonials.sortRating")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          {t("testimonials.results", { count: filteredReviews.length })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredReviews.map((review) => (
          <TestimonialCard key={review.id} review={review} />
        ))}
      </div>

      <div className="rounded-3xl bg-slate-50 p-8 lg:p-10">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            {t("testimonials.writeReview")}
          </h2>
          <p className="text-slate-600">{t("testimonials.formSubtitle")}</p>
        </div>
        <TestimonialForm trips={trips} />
      </div>
    </div>
  );
}
