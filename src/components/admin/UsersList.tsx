import { formatPrice, formatDate } from "@/lib/utils";
import { UserSummary } from "@/actions/admin/users";
import { Mail, CalendarCheck, DollarSign } from "lucide-react";

interface UsersListProps {
  users: UserSummary[];
}

export function UsersList({ users }: UsersListProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bookings</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total Spent</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Booking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No customers found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.email} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{user.bookingCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{formatPrice(user.totalSpent)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.lastBookingDate
                      ? formatDate(new Date(user.lastBookingDate))
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
