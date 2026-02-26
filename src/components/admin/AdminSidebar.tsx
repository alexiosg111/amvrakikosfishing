"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarCheck,
  Sailboat,
  Star,
  Users,
  Package,
  Tag,
  Image,
  BarChart3,
  Settings,
  LogOut,
  Anchor,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "admin/trips", label: "Trips", icon: Sailboat },
  { href: "admin/reviews", label: "Reviews", icon: Star },
  { href: "admin/users", label: "Users", icon: Users },
  { href: "admin/addons", label: "Add-Ons", icon: Package },
  { href: "admin/vouchers", label: "Vouchers", icon: Tag },
  { href: "admin/gallery", label: "Gallery", icon: Image },
  { href: "admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  locale: string;
  onClose?: () => void;
}

export function AdminSidebar({ locale, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const fullPath = `/${locale}/${href}`;
    if (href === "admin") {
      return pathname === fullPath;
    }
    return pathname.startsWith(fullPath);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64">
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <Link href={`/${locale}/admin`} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Anchor className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">Admin Panel</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={`/${locale}/${item.href}`}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Link href={`/${locale}`}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            View Site
          </Button>
        </Link>
      </div>
    </div>
  );
}
