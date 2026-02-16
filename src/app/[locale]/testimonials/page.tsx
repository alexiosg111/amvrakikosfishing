import { getTranslations } from "next-intl/server";
import { getReviews } from "@/actions/reviews";
import { getTrips } from "@/actions/trips";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenSquare, Star } from "lucide-react";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "testimonials" });
  return {
    title: `${t("title")} | Amvrakikos Fishing Trips`,
    description: t("subtitle"),
  };
}

export default async function TestimonialsPage() {
  const t = await getTranslations();
  const reviews = await getReviews();
  const trips = await getTrips();

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-blue-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t("testimonials.title")}
            </h1>
            <p className="text-xl text-blue-100 mb-8">{t("testimonials.subtitle")}</p>

            {/* Rating Summary */}
            {reviews.length > 0 && (
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4">
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                  <span className="text-3xl font-bold text-white">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{t("testimonials.rating")}</p>
                  <p className="text-blue-200 text-sm">
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Write Review Button */}
          <div className="flex justify-center mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-blue-900 hover:bg-blue-800">
                  <PenSquare className="w-5 h-5 mr-2" />
                  {t("testimonials.writeReview")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("testimonials.writeReview")}</DialogTitle>
                </DialogHeader>
                <TestimonialForm trips={trips} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Reviews Grid */}
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <TestimonialCard
                  key={review.id}
                  review={review}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">
                {t("testimonials.noReviews") || "No reviews yet. Be the first to share your experience!"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
