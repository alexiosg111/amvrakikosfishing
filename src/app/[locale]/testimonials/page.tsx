import { getReviews } from "@/actions/reviews";
import { TestimonialsList } from "@/components/testimonials/TestimonialsList";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "testimonials" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function TestimonialsPage() {
  const reviews = await getReviews();

  return <TestimonialsList reviews={reviews} />;
}
