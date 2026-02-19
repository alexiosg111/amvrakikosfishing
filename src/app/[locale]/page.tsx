import { Hero } from "@/components/sections/Hero";
import { FeaturedTrips } from "@/components/sections/FeaturedTrips";
import { TestimonialsPreview } from "@/components/sections/TestimonialsPreview";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { getTrips } from "@/actions/trips";
import { getReviews } from "@/actions/reviews";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hero' });
  const baseUrl = 'https://amvrakikosfishing.com';
  const canonicalUrl = `${baseUrl}/${locale}`;
  const title = t("title");
  
  return {
    title,
    description: t("subtitle"),
    openGraph: {
      title,
      description: t("subtitle"),
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: t("subtitle"),
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function HomePage() {
  const trips = await getTrips();
  const reviews = await getReviews();

  return (
    <>
      <Hero />
      <FeaturedTrips trips={trips} />
      <TestimonialsPreview reviews={reviews.slice(0, 6)} />
      <AboutPreview />
    </>
  );
}
