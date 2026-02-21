"use client";

import { useState } from "react";
import { Voucher } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { deleteVoucher, toggleVoucherStatus, resetVoucherUsage } from "@/actions/admin/vouchers";
import { toast } from "sonner";
import { Edit, Trash2, Eye, EyeOff, RotateCcw, Plus } from "lucide-react";

interface VouchersListProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onNew: () => void;
}

export function VouchersList({ vouchers, onEdit, onNew }: VouchersListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete voucher "${code}"?`)) return;
    setLoading(id + "-delete");
    try {
      await deleteVoucher(id);
      toast.success("Voucher deleted");
    } catch {
      toast.error("Failed to delete voucher");
    } finally {
      setLoading(null);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setLoading(id + "-toggle");
    try {
      await toggleVoucherStatus(id, !isActive);
      toast.success(`Voucher ${!isActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update voucher");
    } finally {
      setLoading(null);
    }
  };

  const handleReset = async (id: string) => {
    if (!confirm("Reset usage count for this voucher?")) return;
    setLoading(id + "-reset");
    try {
      await resetVoucherUsage(id);
      toast.success("Usage count reset");
    } catch {
      toast.error("Failed to reset usage");
    } finally {
      setLoading(null);
    }
  };

  const isExpired = (voucher: Voucher) =>
    voucher.expiresAt ? new Date(voucher.expiresAt) < new Date() : false;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={onNew}>
          <Plus className="w-4 h-4" />
          New Voucher
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Discount</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Min Purchase</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usage</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Expires</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No vouchers found
                  </td>
                </tr>
              ) : (
                vouchers.map((voucher) => {
                  const expired = isExpired(voucher);
                  return (
                    <tr key={voucher.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium">{voucher.code}</td>
                      <td className="px-4 py-3">
                        {voucher.discountType === "PERCENTAGE"
                          ? `${voucher.discountValue}%`
                          : formatPrice(voucher.discountValue)}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({voucher.discountType})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {voucher.minPurchase > 0 ? formatPrice(voucher.minPurchase) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {voucher.usedCount}
                        {voucher.maxUses !== -1 ? ` / ${voucher.maxUses}` : " / ∞"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {voucher.expiresAt ? (
                          <span className={expired ? "text-red-500" : ""}>
                            {formatDate(new Date(voucher.expiresAt))}
                          </span>
                        ) : (
                          "Never"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            expired
                              ? "bg-gray-100 text-gray-600"
                              : voucher.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {expired ? "Expired" : voucher.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onEdit(voucher)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={loading === voucher.id + "-toggle"}
                            onClick={() => handleToggle(voucher.id, voucher.isActive)}
                          >
                            {voucher.isActive ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Reset usage"
                            disabled={loading === voucher.id + "-reset"}
                            onClick={() => handleReset(voucher.id)}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            disabled={loading === voucher.id + "-delete"}
                            onClick={() => handleDelete(voucher.id, voucher.code)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
