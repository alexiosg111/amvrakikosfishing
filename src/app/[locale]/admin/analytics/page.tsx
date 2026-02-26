import {
  getRevenueAnalytics,
  getBookingsByStatus,
  getTripAnalytics,
  getTopCustomers,
  getDashboardStats,
} from "@/actions/admin/analytics";
import { RevenueAnalytics } from "@/components/admin/RevenueAnalytics";
import { BookingAnalytics } from "@/components/admin/BookingAnalytics";
import { PerformanceMetrics } from "@/components/admin/PerformanceMetrics";
import { CustomerAnalytics } from "@/components/admin/CustomerAnalytics";
import { AdminCard } from "@/components/admin/AdminCard";
import { formatPrice } from "@/lib/utils";
import { DollarSign, CalendarCheck, TrendingUp, Users } from "lucide-react";

export default async function AnalyticsPage() {
  const [revenueData, byStatus, tripAnalytics, topCustomers, stats] = await Promise.all([
    getRevenueAnalytics(12),
    getBookingsByStatus(),
    getTripAnalytics(),
    getTopCustomers(10),
    getDashboardStats(),
  ]);

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalBookings = revenueData.reduce((sum, d) => sum + d.bookings, 0);
  const avgOrderValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">Business performance overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          description="All time"
          icon={DollarSign}
          iconClassName="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
        <AdminCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="All time"
          icon={CalendarCheck}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <AdminCard
          title="Avg. Order Value"
          value={formatPrice(avgOrderValue)}
          description="Per booking"
          icon={TrendingUp}
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
        <AdminCard
          title="Unique Customers"
          value={topCustomers.length}
          description="Based on email"
          icon={Users}
          iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
      </div>

      <RevenueAnalytics data={revenueData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingAnalytics byStatus={byStatus} />
        <PerformanceMetrics tripAnalytics={tripAnalytics} />
      </div>

      <CustomerAnalytics topCustomers={topCustomers} />
    </div>
  );
}
