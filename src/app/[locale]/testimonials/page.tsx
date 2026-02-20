"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getReviews } from "@/actions/reviews";
import { createReview } from "@/actions/reviews";
import { getTrips } from "@/actions/trips";
import { Review, Trip } from "@/types";
import { reviewSchema, ReviewFormData } from "@/lib/validations";
import { Star, Quote, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function TestimonialsPage() {
  const t = useTranslations();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  useEffect(() => {
    async function loadData() {
      const [reviewsData, tripsData] = await Promise.all([
        getReviews(),
        getTrips(),
      ]);
      setReviews(reviewsData);
      setTrips(tripsData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      await createReview(data);
      toast.success("Review submitted! It will appear after verification.");
      reset();
      setSelectedRating(0);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("testimonials.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>

          {reviews.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(averageRating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-slate-500">({reviews.length} reviews)</span>
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 relative h-full flex flex-col">
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-100" />

                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-700 flex-1 mb-6 line-clamp-4">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-600 text-white">
                            {review.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {review.userName}
                          </p>
                          {review.trip && (
                            <p className="text-xs text-slate-500">{review.trip.name}</p>
                          )}
                        </div>
                      </div>
                      {review.isVerified && (
                        <span className="text-xs text-teal-600 font-medium">
                          ✓ {t("testimonials.verified")}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <Separator className="my-12" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
            {t("testimonials.writeReview")}
          </h2>
          <p className="text-slate-500 text-center mb-8">
            Share your experience with other fishing enthusiasts
          </p>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="userName">{t("contact.name")}</Label>
                  <Input
                    id="userName"
                    placeholder="Your name"
                    {...register("userName")}
                    className="mt-1"
                  />
                  {errors.userName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.userName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tripId">{t("booking.trip")}</Label>
                  <select
                    id="tripId"
                    {...register("tripId")}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a trip</option>
                    {trips.map((trip) => (
                      <option key={trip.id} value={trip.id}>
                        {trip.name}
                      </option>
                    ))}
                  </select>
                  {errors.tripId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tripId.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>{t("testimonials.rating")}</Label>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleRatingClick(i + 1)}
                        onMouseEnter={() => setHoveredRating(i + 1)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            i < (hoveredRating || selectedRating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rating.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="comment">Your Review</Label>
                  <textarea
                    id="comment"
                    {...register("comment")}
                    rows={4}
                    placeholder="Tell us about your experience..."
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.comment.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 hover:bg-blue-800"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t("testimonials.submit")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
