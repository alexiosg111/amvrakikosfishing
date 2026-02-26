"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BookingAnalyticsProps {
  byStatus: Array<{ status: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PAID: "#10b981",
  CANCELLED: "#ef4444",
  COMPLETED: "#6b7280",
};

export function BookingAnalytics({ byStatus }: BookingAnalyticsProps) {
  const data = byStatus.filter((s) => s.count > 0);

  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold mb-4">Bookings by Status</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No booking data</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              dataKey="count"
              nameKey="status"
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status] || "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
