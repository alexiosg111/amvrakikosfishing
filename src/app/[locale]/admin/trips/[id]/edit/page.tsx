import { getTripWithDetails } from "@/actions/admin/trips";
import { TripEditor } from "@/components/admin/TripEditor";
import { notFound } from "next/navigation";

interface PageProps {
  params: { locale: string; id: string };
}

export default async function EditTripPage({ params: { locale, id } }: PageProps) {
  const trip = await getTripWithDetails(id);

  if (!trip) {
    notFound();
  }

  return <TripEditor trip={trip as any} locale={locale} />;
}
