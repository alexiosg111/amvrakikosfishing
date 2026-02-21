import { getReviews } from "@/actions/reviews";
import { getTrips } from "@/actions/trips";
import { TestimonialsList } from "@/components/sections/TestimonialsList";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "testimonials" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: { tripId?: string; rating?: string };
}) {
  const tripId = searchParams.tripId;
  const rating = searchParams.rating ? parseInt(searchParams.rating) : undefined;
  const reviews = await getReviews(tripId, rating);
  const trips = await getTrips();
  const t = await getTranslations();

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("testimonials.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <TestimonialsList
          initialReviews={reviews}
          trips={trips}
          initialTripId={tripId}
          initialRating={rating}
        />
      </div>
    </div>
  );
}
