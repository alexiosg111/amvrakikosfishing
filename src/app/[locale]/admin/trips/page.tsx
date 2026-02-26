import { getAllTripsAdmin, TripFilters } from "@/actions/admin/trips";
import { TripsList } from "@/components/admin/TripsList";

interface PageProps {
  params: { locale: string };
  searchParams: {
    search?: string;
    isActive?: string;
    isPremium?: string;
  };
}

export default async function TripsPage({ params: { locale }, searchParams }: PageProps) {
  const filters: TripFilters = {
    search: searchParams.search,
    isActive:
      searchParams.isActive === "true"
        ? true
        : searchParams.isActive === "false"
        ? false
        : undefined,
    isPremium:
      searchParams.isPremium === "true"
        ? true
        : searchParams.isPremium === "false"
        ? false
        : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const trips = await getAllTripsAdmin(filters);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Trips</h2>
        <p className="text-muted-foreground">{trips.length} trips total</p>
      </div>

      <TripsList trips={trips} locale={locale} />
    </div>
  );
}
