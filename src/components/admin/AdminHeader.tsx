"use client";

import { Menu, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  onMenuToggle: () => void;
  locale: string;
}

const pageTitles: Record<string, string> = {
  admin: "Dashboard",
  bookings: "Bookings",
  trips: "Trips",
  reviews: "Reviews",
  users: "Users",
  addons: "Add-Ons",
  vouchers: "Vouchers",
  gallery: "Gallery",
  analytics: "Analytics",
  settings: "Settings",
};

export function AdminHeader({ onMenuToggle, locale }: AdminHeaderProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentPage = segments[segments.length - 1] || "admin";
  const title = pageTitles[currentPage] || "Admin Panel";

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/${locale}`} target="_blank">
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Site</span>
          </Button>
        </Link>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span className="uppercase font-medium">{locale}</span>
        </div>
      </div>
    </header>
  );
}
