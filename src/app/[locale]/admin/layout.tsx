import { ReactNode } from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Mail,
  Settings,
  Fish,
  Package,
  Tag,
  ImageIcon,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function AdminLayout({ children, params: { locale } }: AdminLayoutProps) {
  const t = await getTranslations();

  const navItems = [
    { href: `/${locale}/admin`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/admin/bookings`, label: 'Bookings', icon: Calendar },
    { href: `/${locale}/admin/trips`, label: 'Trips', icon: Fish },
    { href: `/${locale}/admin/addons`, label: 'Add-ons', icon: Package },
    { href: `/${locale}/admin/vouchers`, label: 'Vouchers', icon: Tag },
    { href: `/${locale}/admin/messages`, label: 'Messages', icon: Mail },
    { href: `/${locale}/admin/gallery`, label: 'Gallery', icon: ImageIcon },
    { href: `/${locale}/admin/settings`, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 min-h-screen fixed left-0 top-0 z-40">
          <div className="p-6">
            <Link href={`/${locale}`} className="flex items-center gap-2 text-white">
              <Fish className="w-8 h-8" />
              <span className="font-serif text-xl font-bold">Admin</span>
            </Link>
          </div>

          <nav className="px-4 pb-6">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <span className="text-sm">← Back to Website</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
