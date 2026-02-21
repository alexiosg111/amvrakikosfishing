import { getReviews } from "@/actions/reviews";
import { getTranslations } from "next-intl/server";
import { TestimonialsClient } from "./TestimonialsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "testimonials" });
  return {
    title: t("title"),
  };
}

export default async function TestimonialsPage() {
  const reviews = await getReviews();
  
  return <TestimonialsClient reviews={reviews} />;
}
