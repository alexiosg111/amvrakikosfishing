import { Hero } from "@/components/sections/Hero";
import { FeaturedTrips } from "@/components/sections/FeaturedTrips";
import { TestimonialsPreview } from "@/components/sections/TestimonialsPreview";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { getTrips } from "@/actions/trips";
import { getReviews } from "@/actions/reviews";

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
