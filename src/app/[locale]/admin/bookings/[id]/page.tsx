import { getBookingForAdmin } from "@/actions/admin/bookings";
import { BookingDetails } from "@/components/admin/BookingDetails";
import { notFound } from "next/navigation";

interface PageProps {
  params: { locale: string; id: string };
}

export default async function BookingDetailPage({ params: { locale, id } }: PageProps) {
  const booking = await getBookingForAdmin(id);

  if (!booking) {
    notFound();
  }

  return <BookingDetails booking={booking as any} locale={locale} />;
}
