import { AdminCard } from "./AdminCard";
import { DashboardStats as Stats } from "@/actions/admin/analytics";
import {
  CalendarCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  Sailboat,
  Star,
  Calendar,
  DollarSign,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DashboardStatsProps {
  stats: Stats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminCard
        title="Total Bookings"
        value={stats.totalBookings}
        description={`${stats.todayBookings} today · ${stats.weekBookings} this week`}
        icon={CalendarCheck}
        iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
      />
      <AdminCard
        title="Total Revenue"
        value={formatPrice(stats.totalRevenue)}
        description={`${formatPrice(stats.monthRevenue)} this month`}
        icon={DollarSign}
        iconClassName="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
      />
      <AdminCard
        title="Pending Bookings"
        value={stats.pendingBookings}
        description="Awaiting confirmation"
        icon={Clock}
        iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
      />
      <AdminCard
        title="Confirmed Bookings"
        value={stats.confirmedBookings}
        description="Ready to go"
        icon={CheckCircle}
        iconClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
      />
      <AdminCard
        title="Active Trips"
        value={stats.activeTrips}
        description="Available for booking"
        icon={Sailboat}
        iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
      />
      <AdminCard
        title="Total Reviews"
        value={stats.totalReviews}
        description="All time"
        icon={Star}
        iconClassName="bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
      />
      <AdminCard
        title="This Month"
        value={stats.monthBookings}
        description="Bookings this month"
        icon={TrendingUp}
        iconClassName="bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
      />
      <AdminCard
        title="Upcoming Trips"
        value={stats.upcomingTripsThisWeek}
        description="Confirmed/paid in next 7 days"
        icon={Calendar}
        iconClassName="bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400"
      />
    </div>
  );
}
