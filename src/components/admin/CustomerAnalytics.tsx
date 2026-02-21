import { formatPrice } from "@/lib/utils";

interface TopCustomer {
  email: string;
  name: string;
  totalSpent: number;
  bookingCount: number;
}

interface CustomerAnalyticsProps {
  topCustomers: TopCustomer[];
}

export function CustomerAnalytics({ topCustomers }: CustomerAnalyticsProps) {
  return (
    <div className="bg-card rounded-xl border p-6">
      <h3 className="font-semibold mb-4">Top Customers</h3>
      <div className="space-y-3">
        {topCustomers.length === 0 ? (
          <p className="text-muted-foreground text-sm">No customer data</p>
        ) : (
          topCustomers.slice(0, 10).map((customer, index) => (
            <div key={customer.email} className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground w-6 text-center">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{customer.name}</p>
                <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-sm">{formatPrice(customer.totalSpent)}</p>
                <p className="text-xs text-muted-foreground">
                  {customer.bookingCount} bookings
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
