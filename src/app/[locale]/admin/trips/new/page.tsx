import { TripEditor } from "@/components/admin/TripEditor";

interface PageProps {
  params: { locale: string };
}

export default function NewTripPage({ params: { locale } }: PageProps) {
  return <TripEditor locale={locale} />;
}
