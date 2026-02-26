"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { verifyReview, deleteReview } from "@/actions/admin/reviews";
import { toast } from "sonner";
import { CheckCircle, XCircle, Trash2, Star } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: Date;
  trip: { name: string } | null;
}

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleVerify = async (id: string, isVerified: boolean) => {
    setLoading(id + "-verify");
    try {
      await verifyReview(id, !isVerified);
      toast.success(isVerified ? "Review unverified" : "Review verified");
    } catch {
      toast.error("Failed to update review");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setLoading(id + "-delete");
    try {
      await deleteReview(id);
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No reviews found</div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-card rounded-xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold">{review.userName}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {review.isVerified ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {review.trip?.name || "Unknown trip"} ·{" "}
                  {formatDate(new Date(review.createdAt))}
                </p>
                <p className="text-sm">{review.comment}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title={review.isVerified ? "Unverify" : "Verify"}
                  disabled={loading === review.id + "-verify"}
                  onClick={() => handleVerify(review.id, review.isVerified)}
                >
                  {review.isVerified ? (
                    <XCircle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Delete"
                  disabled={loading === review.id + "-delete"}
                  onClick={() => handleDelete(review.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
