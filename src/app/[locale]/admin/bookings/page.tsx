import { getAllBookings, BookingFilters } from "@/actions/admin/bookings";
import { BookingsList } from "@/components/admin/BookingsList";
import { BookingFilters as BookingFiltersUI } from "@/components/admin/BookingFilters";
import { Pagination } from "@/components/admin/Pagination";
import { Suspense } from "react";
import { BookingStatus } from "@/types";

interface PageProps {
  params: { locale: string };
  searchParams: {
    search?: string;
    status?: string;
    sortBy?: string;
    page?: string;
  };
}

export default async function BookingsPage({ params: { locale }, searchParams }: PageProps) {
  const filters: BookingFilters = {
    search: searchParams.search,
    status: (searchParams.status as BookingStatus) || "ALL",
    sortBy: (searchParams.sortBy as BookingFilters["sortBy"]) || "createdAt",
    sortOrder: "desc",
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    pageSize: 20,
  };

  const { bookings, total, page, pageSize, totalPages } = await getAllBookings(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bookings</h2>
          <p className="text-muted-foreground">{total} total bookings</p>
        </div>
      </div>

      <Suspense>
        <BookingFiltersUI />
      </Suspense>

      <BookingsList bookings={bookings as any} locale={locale} />

      <Suspense>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}
