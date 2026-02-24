import { getTrips } from "@/actions/trips";
import { TripCard } from "@/components/trips/TripCard";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trips" });
  return {
    title: t("title"),
  };
}

export default async function TripsPage() {
  const trips = await getTrips();
  const t = await getTranslations();

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("trips.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("trips.subtitle")}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Badge variant="default" className="px-4 py-2 cursor-pointer bg-blue-900">
            {t("trips.allTrips")}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-slate-100">
            {t("trips.premium")}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-slate-100">
            {t("trips.standard")}
          </Badge>
        </div>

        {/* Trips grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {trips.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">No trips available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
