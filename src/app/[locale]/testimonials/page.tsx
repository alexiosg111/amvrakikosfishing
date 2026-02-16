import { getReviews } from "@/actions/reviews";
import { getTranslations } from "next-intl/server";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote } from "lucide-react";

export default async function TestimonialsPage() {
  const reviews = await getReviews();
  const t = await getTranslations();

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // Group reviews by rating
  const fiveStarReviews = reviews.filter((r) => r.rating === 5);
  const fourStarReviews = reviews.filter((r) => r.rating === 4);

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("testimonials.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        {/* Stats */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <Card className="bg-gradient-to-br from-blue-900 to-teal-800 text-white">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                      <span className="text-5xl font-bold">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-white/80">Average Rating</p>
                  </div>
                  <div>
                    <p className="text-5xl font-bold mb-2">{reviews.length}</p>
                    <p className="text-white/80">Total Reviews</p>
                  </div>
                  <div>
                    <p className="text-5xl font-bold mb-2">
                      {Math.round((fiveStarReviews.length / reviews.length) * 100)}%
                    </p>
                    <p className="text-white/80">5-Star Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Featured Reviews - 5 Star */}
        {fiveStarReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Featured Reviews
              </h2>
              <Badge className="bg-amber-500 text-white">
                <Star className="w-3 h-3 mr-1 fill-white" />
                5-Star
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fiveStarReviews.slice(0, 4).map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 border-amber-200">
                    <CardContent className="p-6">
                      <Quote className="w-8 h-8 text-amber-200 mb-4" />
                      <div className="flex items-center justify-between mb-4">
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
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {t("testimonials.verified")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Reviews */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">
              All Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
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
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {t("testimonials.verified")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1 mb-3">
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
                        {review.comment}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No reviews state */}
        {reviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Quote className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">
              No Reviews Yet
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Be the first to share your fishing adventure experience with us!
            </p>
            <Button className="bg-blue-900 hover:bg-blue-800">
              {t("testimonials.writeReview")}
            </Button>
          </motion.div>
        )}

        {/* CTA */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-blue-900 to-teal-800 text-white">
              <CardContent className="p-8 md:p-12">
                <Quote className="w-12 h-12 text-white/30 mb-6" />
                <h2 className="font-serif text-2xl font-bold mb-4">
                  Had a great experience?
                </h2>
                <p className="text-white/90 mb-6">
                  Share your fishing adventure with us and help others discover the
                  beauty of Amvrakikos Bay!
                </p>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  {t("testimonials.writeReview")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
