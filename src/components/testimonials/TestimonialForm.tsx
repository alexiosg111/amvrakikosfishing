"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ReviewFormData, reviewSchema } from "@/lib/validations";
import { createReview } from "@/actions/reviews";
import { Trip } from "@/types";
import { StarRating } from "@/components/testimonials/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface TestimonialFormProps {
  trips: Trip[];
}

export function TestimonialForm({ trips }: TestimonialFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
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
      await createReview(data);
      toast.success(t("testimonials.formSuccess"));
      reset({ rating: 5, tripId: "", userId: "", comment: "" });
    } catch (error) {
      toast.error(t("testimonials.formError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tripId">{t("testimonials.trip")}</Label>
        <Controller
          control={control}
          name="tripId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("testimonials.selectTrip")} />
              </SelectTrigger>
              <SelectContent>
                {trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.tripId && <p className="text-sm text-red-500">{errors.tripId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="userId">{t("testimonials.name")}</Label>
        <Input id="userId" {...register("userId")} placeholder={t("testimonials.namePlaceholder")} />
        {errors.userId && <p className="text-sm text-red-500">{errors.userId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t("testimonials.rating")}</Label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <StarRating rating={field.value} onChange={field.onChange} size="lg" />
          )}
        />
        {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">{t("testimonials.comment")}</Label>
        <textarea
          id="comment"
          rows={4}
          {...register("comment")}
          placeholder={t("testimonials.commentPlaceholder")}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
        />
        {errors.comment && <p className="text-sm text-red-500">{errors.comment.message}</p>}
      </div>

      <Button type="submit" className="bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("testimonials.submit")}
      </Button>
    </form>
  );
}
