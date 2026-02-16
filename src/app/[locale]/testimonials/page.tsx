import { getReviews } from "@/actions/reviews";
import { getTrips } from "@/actions/trips";
import { TestimonialsContent } from "@/components/testimonials/TestimonialsContent";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "testimonials" });
  return {
    title: t("title"),
  };
}

export default async function TestimonialsPage() {
  const [reviews, trips] = await Promise.all([getReviews(), getTrips()]);
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

        <TestimonialsContent reviews={reviews} trips={trips} />
      </div>
    </div>
  );
}
