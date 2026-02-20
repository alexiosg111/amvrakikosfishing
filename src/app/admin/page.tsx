"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminBookings } from "@/components/admin/AdminBookings";
import { AdminTrips } from "@/components/admin/AdminTrips";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { AdminGallery } from "@/components/admin/AdminGallery";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Loader2 } from "lucide-react";

export type AdminTab = "dashboard" | "bookings" | "trips" | "reviews" | "messages" | "gallery";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch("/api/admin/auth/check");
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6 lg:p-8"
        >
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "bookings" && <AdminBookings />}
          {activeTab === "trips" && <AdminTrips />}
          {activeTab === "reviews" && <AdminReviews />}
          {activeTab === "messages" && <AdminMessages />}
          {activeTab === "gallery" && <AdminGallery />}
        </motion.div>
      </main>
    </div>
  );
}
