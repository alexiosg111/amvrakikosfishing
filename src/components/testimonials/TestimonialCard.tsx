"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Review } from "@/types";
import { StarRating } from "@/components/testimonials/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2 } from "lucide-react";

interface TestimonialCardProps {
  review: Review;
}

export function TestimonialCard({ review }: TestimonialCardProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const comment = review.comment || t("testimonials.noComment");
  const isLong = comment.length > 160;
  const displayName = review.userId;
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-blue-600 text-white">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-slate-900">{displayName}</p>
            {review.trip?.name && (
              <p className="text-sm text-slate-500">{review.trip.name}</p>
            )}
          </div>
        </div>
        {review.isVerified && (
          <Badge variant="secondary" className="flex items-center gap-1 bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {t("testimonials.verified")}
          </Badge>
        )}
      </div>

      <div className="mt-4">
        <StarRating rating={review.rating} />
      </div>

      <p className={`mt-4 text-slate-600 ${!expanded ? "line-clamp-4" : ""}`}>
        {comment}
      </p>

      {isLong && (
        <Button
          variant="link"
          className="mt-2 px-0 text-blue-700"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? t("common.showLess") : t("common.readMore")}
        </Button>
      )}
    </div>
  );
}
