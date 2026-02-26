import { getDashboardStats, getRevenueAnalytics, getBookingTrends, getRecentActivity } from "@/actions/admin/analytics";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { BookingChart } from "@/components/admin/BookingChart";
import { QuickActions } from "@/components/admin/QuickActions";

export default async function AdminDashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [stats, revenueData, trendData, activityData] = await Promise.all([
    getDashboardStats(),
    getRevenueAnalytics(12),
    getBookingTrends(30),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to the admin panel</p>
      </div>

      <DashboardStats stats={stats} />

      <QuickActions locale={locale} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <BookingChart data={trendData} />
      </div>

      <RecentActivity data={activityData} locale={locale} />
    </div>
  );
}
