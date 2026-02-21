"use client";

import { useState, useEffect } from "react";
import { Voucher } from "@/types";
import { getAllVouchers, getVoucherStats } from "@/actions/admin/vouchers";
import { VouchersList } from "@/components/admin/VouchersList";
import { VoucherEditor } from "@/components/admin/VoucherEditor";
import { AdminCard } from "@/components/admin/AdminCard";
import { Tag, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, totalUsage: 0 });
  const [editingVoucher, setEditingVoucher] = useState<Voucher | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [vouchersData, statsData] = await Promise.all([
      getAllVouchers(),
      getVoucherStats(),
    ]);
    setVouchers(vouchersData);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingVoucher(undefined);
    setShowEditor(true);
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingVoucher(undefined);
    loadData();
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingVoucher(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading vouchers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vouchers</h2>
        <p className="text-muted-foreground">{vouchers.length} vouchers total</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCard
          title="Total Vouchers"
          value={stats.total}
          icon={Tag}
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
        <AdminCard
          title="Active"
          value={stats.active}
          icon={CheckCircle}
          iconClassName="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
        <AdminCard
          title="Expired"
          value={stats.expired}
          icon={Clock}
          iconClassName="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
        />
        <AdminCard
          title="Total Uses"
          value={stats.totalUsage}
          icon={TrendingUp}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
      </div>

      {showEditor ? (
        <div className="bg-card rounded-xl border p-6 max-w-lg">
          <h3 className="font-semibold mb-4">
            {editingVoucher ? "Edit Voucher" : "New Voucher"}
          </h3>
          <VoucherEditor
            voucher={editingVoucher}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <VouchersList vouchers={vouchers} onEdit={handleEdit} onNew={handleNew} />
      )}
    </div>
  );
}
