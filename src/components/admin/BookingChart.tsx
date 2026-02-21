"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BookingTrendData } from "@/actions/admin/analytics";

interface BookingChartProps {
  data: BookingTrendData[];
}

export function BookingChart({ data }: BookingChartProps) {
  const displayData = data.slice(-14);

  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold mb-4">Booking Trends (Last 14 Days)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={displayData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value: number) => [value, "Bookings"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
