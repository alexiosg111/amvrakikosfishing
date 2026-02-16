"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trip } from "@/types";
import { reviewSchema, ReviewFormData } from "@/lib/validations";
import { createReview } from "@/actions/reviews";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TestimonialFormProps {
  trips: Trip[];
  onSuccess?: () => void;
}

export function TestimonialForm({ trips, onSuccess }: TestimonialFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      await createReview({ ...data, rating });
      toast.success(t("testimonials.submitSuccess") || "Review submitted successfully!");
      reset();
      setRating(5);
      onSuccess?.();
    } catch (error) {
      toast.error(t("testimonials.submitError") || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
    setValue("rating", value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Trip Selection */}
      <div className="space-y-2">
        <Label htmlFor="tripId">{t("testimonials.selectTrip") || "Select Trip"}</Label>
        <Select onValueChange={(value) => setValue("tripId", value)}>
          <SelectTrigger className={errors.tripId ? "border-red-500" : ""}>
            <SelectValue placeholder={t("testimonials.selectTripPlaceholder") || "Choose a trip"} />
          </SelectTrigger>
          <SelectContent>
            {trips.map((trip) => (
              <SelectItem key={trip.id} value={trip.id}>
                {trip.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tripId && (
          <p className="text-red-500 text-sm">{errors.tripId.message}</p>
        )}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="userName">{t("booking.contactName")}</Label>
        <Input
          id="userName"
          {...register("userName")}
          placeholder={t("testimonials.namePlaceholder") || "Your name"}
          className={errors.userName ? "border-red-500" : ""}
        />
        {errors.userName && (
          <p className="text-red-500 text-sm">{errors.userName.message}</p>
        )}
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label>{t("testimonials.rating")}</Label>
        <div className="flex items-center gap-3">
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onRate={handleRatingChange}
          />
          <span className="text-slate-600 font-medium">{rating}/5</span>
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="comment">{t("testimonials.comment") || "Your Review"}</Label>
        <Textarea
          id="comment"
          {...register("comment")}
          placeholder={t("testimonials.commentPlaceholder") || "Share your experience..."}
          rows={4}
          className={errors.comment ? "border-red-500" : ""}
        />
        {errors.comment && (
          <p className="text-red-500 text-sm">{errors.comment.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-blue-900 hover:bg-blue-800"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("common.loading")}
          </>
        ) : (
          t("testimonials.submit")
        )}
      </Button>

      <p className="text-slate-500 text-sm text-center">
        {t("testimonials.moderationNotice") || "Reviews are moderated before being published."}
      </p>
    </form>
  );
}
