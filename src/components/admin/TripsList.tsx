"use client";

import { useState } from "react";
import { Trip } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toggleTripStatus, deleteTrip, duplicateTrip } from "@/actions/admin/trips";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Star,
  Users,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface TripsListProps {
  trips: Trip[];
  locale: string;
}

export function TripsList({ trips, locale }: TripsListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggle = async (id: string, isActive: boolean) => {
    setLoading(id + "-toggle");
    try {
      await toggleTripStatus(id, !isActive);
      toast.success(`Trip ${!isActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update trip status");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    setLoading(id + "-delete");
    try {
      await deleteTrip(id);
      toast.success("Trip deleted");
    } catch {
      toast.error("Failed to delete trip");
    } finally {
      setLoading(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setLoading(id + "-dup");
    try {
      await duplicateTrip(id);
      toast.success("Trip duplicated");
    } catch {
      toast.error("Failed to duplicate trip");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href={`/${locale}/admin/trips/new`}>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            New Trip
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {trips.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No trips found
          </div>
        )}
        {trips.map((trip) => (
          <div
            key={trip.id}
            className={`bg-card rounded-xl border p-5 space-y-4 ${
              !trip.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{trip.name}</h3>
                  {trip.isPremium && (
                    <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-amber-500" />
                      Premium
                    </span>
                  )}
                  {!trip.isActive && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {trip.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {trip.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Max {trip.maxParticipants}
              </span>
              <span className="font-semibold text-foreground">
                {formatPrice(trip.basePrice)}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/${locale}/admin/trips/${trip.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={loading === trip.id + "-dup"}
                onClick={() => handleDuplicate(trip.id)}
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={loading === trip.id + "-toggle"}
                onClick={() => handleToggle(trip.id, trip.isActive)}
              >
                {trip.isActive ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    Activate
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive"
                disabled={loading === trip.id + "-delete"}
                onClick={() => handleDelete(trip.id, trip.name)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
