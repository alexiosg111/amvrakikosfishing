import { Toaster } from "@/components/ui/sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function DashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar locale={locale} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
      <Toaster />
    </div>
  );
}
