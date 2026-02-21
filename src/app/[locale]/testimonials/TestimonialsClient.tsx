"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Review } from "@/types";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialsClientProps {
  reviews: Review[];
}

export function TestimonialsClient({ reviews }: TestimonialsClientProps) {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
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

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("testimonials.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        {reviews.length > 0 ? (
          <>
            {/* Featured Testimonial (Carousel Style) */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="relative bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <Quote className="absolute top-6 left-6 w-12 h-12 text-blue-900/20" />
                
                <div className="text-center">
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < reviews[currentIndex].rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl text-slate-700 mb-8 italic">
                    &ldquo;{reviews[currentIndex].comment}&rdquo;
                  </blockquote>

                  <div className="flex items-center justify-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-900 text-white">
                        {reviews[currentIndex].userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold text-slate-900">
                        {reviews[currentIndex].userName}
                      </p>
                      {reviews[currentIndex].isVerified && (
                        <p className="text-sm text-green-600">
                          {t("testimonials.verified")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                {reviews.length > 1 && (
                  <div className="flex justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevReview}
                      className="rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="flex items-center text-sm text-slate-500">
                      {currentIndex + 1} / {reviews.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextReview}
                      className="rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* All Reviews Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {reviews.map((review) => (
                <motion.div key={review.id} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
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

                      <p className="text-slate-600 mb-6 line-clamp-4">
                        &ldquo;{review.comment}&rdquo;
                      </p>

                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Avatar>
                          <AvatarFallback className="bg-blue-900 text-white">
                            {review.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{review.userName}</p>
                          {review.isVerified && (
                            <p className="text-xs text-green-600">
                              {t("testimonials.verified")}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
}
