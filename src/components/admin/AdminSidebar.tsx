"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogoutButton } from "@/components/admin/LogoutButton";
import {
  Anchor,
  LayoutDashboard,
  Ship,
  CalendarCheck,
  Image,
  MessageSquare,
  Star,
  Tag,
} from "lucide-react";

interface AdminSidebarProps {
  locale: string;
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/admin/trips`,
      label: "Trips",
      icon: Ship,
    },
    {
      href: `/${locale}/admin/bookings`,
      label: "Bookings",
      icon: CalendarCheck,
    },
    {
      href: `/${locale}/admin/gallery`,
      label: "Gallery",
      icon: Image,
    },
    {
      href: `/${locale}/admin/reviews`,
      label: "Reviews",
      icon: Star,
    },
    {
      href: `/${locale}/admin/messages`,
      label: "Messages",
      icon: MessageSquare,
    },
    {
      href: `/${locale}/admin/vouchers`,
      label: "Vouchers",
      icon: Tag,
    },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}/admin`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-blue-800">
        <Link href={`/${locale}/admin`} className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-lg font-bold">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <LogoutButton locale={locale} />
      </div>
    </aside>
  );
}
