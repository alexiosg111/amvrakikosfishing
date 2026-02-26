import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminRootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return <AdminLayout locale={locale}>{children}</AdminLayout>;
}
