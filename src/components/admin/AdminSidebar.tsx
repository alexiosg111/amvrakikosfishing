"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Fish,
  Star,
  MessageSquare,
  Image,
  LogOut,
  Anchor,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTab } from "@/app/admin/page";
import { useState } from "react";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
}

const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "bookings", label: "Bookings", icon: <Calendar className="w-5 h-5" /> },
  { id: "trips", label: "Trips", icon: <Fish className="w-5 h-5" /> },
  { id: "reviews", label: "Reviews", icon: <Star className="w-5 h-5" /> },
  { id: "messages", label: "Messages", icon: <MessageSquare className="w-5 h-5" /> },
  { id: "gallery", label: "Gallery", icon: <Image className="w-5 h-5" /> },
];

export function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Admin Panel</p>
            <p className="text-xs text-slate-400">Amvrakikos Fishing</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm font-medium ${
              activeTab === item.id
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full text-slate-400 hover:text-red-400 hover:bg-slate-700 justify-start gap-3"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: isMobileOpen ? 0 : undefined }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 flex-shrink-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform lg:transition-none
        `}
      >
        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {sidebarContent}
      </motion.aside>
    </>
  );
}
