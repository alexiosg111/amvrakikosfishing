"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getReviews } from "@/actions/reviews";
import { createReview } from "@/actions/reviews";
import { Review, Trip } from "@/types";
import { getTrips } from "@/actions/trips";
import { Star, Quote, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export default function TestimonialsPage() {
  const t = useTranslations();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [selectedTripId, setSelectedTripId] = useState("");
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [reviewsData, tripsData] = await Promise.all([
          getReviews(),
          getTrips(),
        ]);
        setReviews(reviewsData);
        setTrips(tripsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmitReview = async () => {
    if (!selectedTripId || !userName || !comment) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        tripId: selectedTripId,
        userName,
        rating,
        comment,
      });
      toast.success(t("testimonials.submit"));
      setIsDialogOpen(false);
      // Reset form
      setSelectedTripId("");
      setUserName("");
      setRating(5);
      setComment("");
      // Reload reviews
      const updatedReviews = await getReviews();
      setReviews(updatedReviews);
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("testimonials.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            {t("testimonials.subtitle")}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-900">{reviews.length}</p>
              <p className="text-slate-600">Reviews</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-4xl font-bold text-amber-500">{averageRating}</p>
                <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-slate-600">{t("testimonials.rating")}</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800">
                {t("testimonials.writeReview")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("testimonials.writeReview")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="trip">Trip</Label>
                  <select
                    id="trip"
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a trip</option>
                    {trips.map((trip) => (
                      <option key={trip.id} value={trip.id}>
                        {trip.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="userName">{t("contact.name")}</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label>{t("testimonials.rating")}</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your experience..."
                  />
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 hover:bg-blue-800"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t("testimonials.submit")
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Reviews grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {reviews.map((review) => (
              <motion.div key={review.id} variants={itemVariants}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-600 text-white">
                            {review.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {review.isVerified && (
                        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3" />
                          {t("testimonials.verified")}
                        </div>
                      )}
                    </div>

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

                    <p className="text-slate-700 leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    {review.trip && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-slate-500">
                          Trip: <span className="font-medium text-slate-700">{review.trip.name}</span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {reviews.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <Quote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
}
