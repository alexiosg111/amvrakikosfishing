"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({ rating, onChange, size = "md" }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        const isActive = value <= rating;
        const star = (
          <Star
            className={cn(
              sizeClasses[size],
              isActive ? "text-amber-400 fill-amber-400" : "text-slate-300"
            )}
          />
        );

        if (!onChange) {
          return <span key={value}>{star}</span>;
        }

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className="transition-transform hover:scale-110"
            aria-label={`Rate ${value} stars`}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
