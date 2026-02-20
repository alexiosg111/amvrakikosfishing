"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Star, TrendingUp, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  paidBookings: number;
  totalRevenue: number;
  pendingReviews: number;
  unreadMessages: number;
  recentBookings: any[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [bookingsRes, reviewsRes, messagesRes] = await Promise.all([
          fetch("/api/admin/bookings"),
          fetch("/api/admin/reviews"),
          fetch("/api/admin/messages"),
        ]);

        const bookings = await bookingsRes.json();
        const reviews = await reviewsRes.json();
        const messages = await messagesRes.json();

        const totalRevenue = bookings
          .filter((b: any) => b.status === "PAID" || b.status === "COMPLETED")
          .reduce((sum: number, b: any) => sum + b.totalPrice, 0);

        setStats({
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.status === "PENDING").length,
          paidBookings: bookings.filter((b: any) => b.status === "PAID" || b.status === "COMPLETED").length,
          totalRevenue,
          pendingReviews: reviews.filter((r: any) => !r.isVerified).length,
          unreadMessages: messages.filter((m: any) => m.status === "unread").length,
          recentBookings: bookings.slice(0, 5),
        });
      } catch {
        console.error("Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
      subtitle: `${stats?.pendingBookings} pending`,
    },
    {
      title: "Paid Bookings",
      value: stats?.paidBookings || 0,
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50",
      subtitle: "confirmed payments",
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      icon: <DollarSign className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50",
      subtitle: "from paid bookings",
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews || 0,
      icon: <Star className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50",
      subtitle: "awaiting approval",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PAID: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-1">{card.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats?.unreadMessages ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-800 text-sm">
            You have <strong>{stats.unreadMessages}</strong> unread contact message{stats.unreadMessages !== 1 ? "s" : ""}.
          </p>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentBookings && stats.recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-2 font-medium text-slate-500">Guest</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-500">Trip</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-500">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-500">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((booking: any) => (
                    <tr key={booking.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-2 font-medium text-slate-900">{booking.contactName}</td>
                      <td className="py-3 px-2 text-slate-600">{booking.trip?.name}</td>
                      <td className="py-3 px-2 text-slate-600">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 font-medium">{formatPrice(booking.totalPrice)}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || ""}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No bookings yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
