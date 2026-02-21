"use client";

import { useState } from "react";
import { AddOn } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { deleteAddOn, toggleAddOnStatus } from "@/actions/admin/addons";
import { toast } from "sonner";
import { Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react";

interface AddOnsListProps {
  addOns: AddOn[];
  onEdit: (addOn: AddOn) => void;
  onNew: () => void;
}

const categoryColors: Record<string, string> = {
  GENERAL: "bg-slate-100 text-slate-700",
  FOOD: "bg-orange-100 text-orange-700",
  TRANSPORT: "bg-blue-100 text-blue-700",
  EQUIPMENT: "bg-purple-100 text-purple-700",
  PHOTO: "bg-pink-100 text-pink-700",
  PREMIUM: "bg-amber-100 text-amber-700",
};

export function AddOnsList({ addOns, onEdit, onNew }: AddOnsListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setLoading(id + "-delete");
    try {
      await deleteAddOn(id);
      toast.success("Add-on deleted");
    } catch {
      toast.error("Failed to delete add-on");
    } finally {
      setLoading(null);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setLoading(id + "-toggle");
    try {
      await toggleAddOnStatus(id, !isActive);
      toast.success(`Add-on ${!isActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update add-on");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={onNew}>
          <Plus className="w-4 h-4" />
          New Add-On
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {addOns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No add-ons found
                  </td>
                </tr>
              ) : (
                addOns.map((addOn) => (
                  <tr key={addOn.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{addOn.name}</p>
                      <p className="text-xs text-muted-foreground">{addOn.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          categoryColors[addOn.category] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {addOn.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(addOn.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          addOn.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {addOn.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(addOn)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={loading === addOn.id + "-toggle"}
                          onClick={() => handleToggle(addOn.id, addOn.isActive)}
                        >
                          {addOn.isActive ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          disabled={loading === addOn.id + "-delete"}
                          onClick={() => handleDelete(addOn.id, addOn.name)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
