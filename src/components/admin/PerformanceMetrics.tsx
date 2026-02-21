import { formatPrice } from "@/lib/utils";
import { TrendingUp, Star, CalendarCheck } from "lucide-react";

interface TripMetric {
  id: string;
  name: string;
  bookingCount: number;
  revenue: number;
  averageRating: number;
  reviewCount: number;
}

interface PerformanceMetricsProps {
  tripAnalytics: TripMetric[];
}

export function PerformanceMetrics({ tripAnalytics }: PerformanceMetricsProps) {
  const sorted = [...tripAnalytics].sort((a, b) => b.bookingCount - a.bookingCount);

  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold mb-4">Trip Performance</h3>
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-sm">No trip data available</p>
        ) : (
          sorted.map((trip) => (
            <div key={trip.id} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{trip.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <CalendarCheck className="w-3 h-3" />
                    {trip.bookingCount} bookings
                  </span>
                  {trip.averageRating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {trip.averageRating.toFixed(1)} ({trip.reviewCount})
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-sm">{formatPrice(trip.revenue)}</p>
                <p className="text-xs text-muted-foreground">revenue</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
