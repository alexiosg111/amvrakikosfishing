import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, CalendarCheck, Star, Download, Sailboat } from "lucide-react";

interface QuickActionsProps {
  locale: string;
}

export function QuickActions({ locale }: QuickActionsProps) {
  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-3">
        <Link href={`/${locale}/admin/trips/new`}>
          <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Create Trip
          </Button>
        </Link>
        <Link href={`/${locale}/admin/bookings`}>
          <Button size="sm" variant="outline" className="gap-2">
            <CalendarCheck className="w-4 h-4" />
            View Bookings
          </Button>
        </Link>
        <Link href={`/${locale}/admin/reviews`}>
          <Button size="sm" variant="outline" className="gap-2">
            <Star className="w-4 h-4" />
            Moderate Reviews
          </Button>
        </Link>
        <Link href={`/${locale}/admin/analytics`}>
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </Link>
        <Link href={`/${locale}/admin/trips`}>
          <Button size="sm" variant="outline" className="gap-2">
            <Sailboat className="w-4 h-4" />
            Manage Trips
          </Button>
        </Link>
      </div>
    </div>
  );
}
