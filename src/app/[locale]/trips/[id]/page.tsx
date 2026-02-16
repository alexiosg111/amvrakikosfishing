import { getTripById, getTripReviews } from "@/actions/trips";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, Check, Star, MapPin, Calendar } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface TripPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export async function generateMetadata({ params }: TripPageProps) {
  const trip = await getTripById(params.id);
  return {
    title: trip?.name || "Trip Not Found",
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const trip = await getTripById(params.id);
  const reviews = await getTripReviews(params.id);
  const t = await getTranslations();

  if (!trip) {
    notFound();
  }

  const imageUrl = trip.images[0] || "https://placehold.co/1200x600/1a365d/white?text=Fishing+Trip";

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12">
          <Image
            src={imageUrl}
            alt={trip.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              {trip.isPremium && (
                <Badge className="bg-amber-500 text-white">
                  {t("trips.bestChoice")}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-white/20 text-white">
                {trip.duration} {t("common.hours")}
              </Badge>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-2">
              {trip.name}
            </h1>
            <p className="text-xl text-white/90">
              {formatPrice(trip.basePrice)} {t("trips.perPerson")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  {t("trips.learnMore")}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  {t("testimonials.title")} ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                  {t("trips.description")}
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {trip.description}
                </p>

                <h3 className="font-semibold text-lg text-slate-900 mb-4">
                  {t("trips.highlights")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {trip.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="text-slate-700">{highlight}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-8" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">{trip.duration}</p>
                    <p className="text-sm text-slate-500">{t("trips.duration")}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">{trip.maxParticipants}</p>
                    <p className="text-sm text-slate-500">{t("trips.maxParticipants")}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">Amvrakikos</p>
                    <p className="text-sm text-slate-500">Location</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">Daily</p>
                    <p className="text-sm text-slate-500">Availability</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-slate-50 rounded-xl p-6">
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
                          <div className="flex gap-1">
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
                        </div>
                        <p className="text-slate-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-6 border">
              <div className="text-center mb-6">
                <p className="text-sm text-slate-500 mb-1">{t("trips.from")}</p>
                <p className="text-4xl font-bold text-blue-900">
                  {formatPrice(trip.basePrice)}
                </p>
                <p className="text-sm text-slate-500">{t("trips.perPerson")}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Duration</span>
                  <span className="font-semibold">{trip.duration} {t("common.hours")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Max Participants</span>
                  <span className="font-semibold">{trip.maxParticipants}</span>
                </div>
              </div>

              <Link href={`/booking?trip=${trip.id}`}>
                <Button className="w-full bg-blue-900 hover:bg-blue-800 py-6 text-lg">
                  {t("trips.bookNow")}
                </Button>
              </Link>

              <p className="text-xs text-slate-500 text-center mt-4">
                Free cancellation up to 24 hours before
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
