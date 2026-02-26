import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, CalendarCheck, MessageSquare, Star } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  const [tripCount, bookingCount, messageCount, reviewCount] =
    await Promise.all([
      prisma.trip.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.contactMessage.count({ where: { status: "unread" } }),
      prisma.review.count({ where: { isVerified: false } }),
    ]);

  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { trip: true },
  });

  const stats = [
    {
      title: "Active Trips",
      value: tripCount,
      icon: Ship,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Bookings",
      value: bookingCount,
      icon: CalendarCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Unread Messages",
      value: messageCount,
      icon: MessageSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Pending Reviews",
      value: reviewCount,
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-slate-500 text-sm">No bookings yet.</p>
          ) : (
            <div className="divide-y">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {booking.contactName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {booking.trip?.name} &mdash;{" "}
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "PAID"
                          ? "bg-blue-100 text-blue-700"
                          : booking.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
