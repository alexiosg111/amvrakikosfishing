"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Review, Trip } from "@/types";
import { StarRating } from "./StarRating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Quote } from "lucide-react";
import { format } from "date-fns";

interface TestimonialCardProps {
  review: Review & { trip?: Trip };
  index?: number;
}

export function TestimonialCard({ review, index = 0 }: TestimonialCardProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  const maxLength = 150;
  const shouldTruncate = review.comment.length > maxLength;
  const displayComment =
    expanded || !shouldTruncate
      ? review.comment
      : review.comment.slice(0, maxLength) + "...";

  const initials = review.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-blue-100 mb-4" />

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <StarRating rating={review.rating} />
        <span className="text-slate-600 text-sm font-medium">
          {review.rating}.0
        </span>
      </div>

      {/* Comment */}
      <p className="text-slate-700 mb-4 leading-relaxed">{displayComment}</p>
      {shouldTruncate && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="p-0 h-auto text-blue-600"
        >
          {expanded ? t("common.showLess") : t("common.readMore")}
        </Button>
      )}

      {/* Trip info */}
      {review.trip && (
        <p className="text-slate-500 text-sm mb-4">
          {t("testimonials.trip")}: {review.trip.name}
        </p>
      )}

      {/* Author */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 bg-blue-100">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-slate-900">{review.userName}</p>
            <p className="text-slate-500 text-sm">
              {format(new Date(review.createdAt), "MMM yyyy")}
            </p>
          </div>
        </div>

        {review.isVerified && (
          <Badge
            variant="secondary"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            {t("testimonials.verified")}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
