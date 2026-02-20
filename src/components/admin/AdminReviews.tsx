"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Star, Check, X, Trash2 } from "lucide-react";

export function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleVerified(id: string, isVerified: boolean) {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVerified }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isVerified } : r))
        );
        toast.success(isVerified ? "Review approved" : "Review hidden");
      }
    } catch {
      toast.error("Failed to update review");
    }
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("Review deleted");
      }
    } catch {
      toast.error("Failed to delete review");
    }
  }

  const pending = reviews.filter((r) => !r.isVerified);
  const approved = reviews.filter((r) => r.isVerified);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
        <p className="text-slate-500 mt-1">
          {pending.length} pending · {approved.length} approved
        </p>
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            Pending Approval ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onApprove={() => toggleVerified(review.id, true)}
                onReject={() => deleteReview(review.id)}
                onDelete={() => deleteReview(review.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Approved ({approved.length})
        </h2>
        {approved.length > 0 ? (
          <div className="space-y-4">
            {approved.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHide={() => toggleVerified(review.id, false)}
                onDelete={() => deleteReview(review.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No approved reviews yet.</p>
        )}
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  onApprove,
  onReject,
  onHide,
  onDelete,
}: {
  review: any;
  onApprove?: () => void;
  onReject?: () => void;
  onHide?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-slate-900">{review.userName}</p>
              <span className="text-xs text-slate-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.trip && (
              <p className="text-xs text-blue-600 mb-2">{review.trip.name}</p>
            )}
            <div className="flex gap-0.5 mb-2">
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
            <p className="text-sm text-slate-700">{review.comment}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {onApprove && (
              <Button
                size="sm"
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            {onHide && (
              <Button size="sm" variant="outline" onClick={onHide}>
                <X className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={onDelete}
                className="text-red-500 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
