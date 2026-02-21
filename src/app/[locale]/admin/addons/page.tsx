"use client";

import { useState, useEffect } from "react";
import { AddOn } from "@/types";
import { getAllAddOns } from "@/actions/admin/addons";
import { AddOnsList } from "@/components/admin/AddOnsList";
import { AddOnEditor } from "@/components/admin/AddOnEditor";

export default function AddOnsPage() {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [editingAddOn, setEditingAddOn] = useState<AddOn | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAddOns = async () => {
    setLoading(true);
    const data = await getAllAddOns();
    setAddOns(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAddOns();
  }, []);

  const handleEdit = (addOn: AddOn) => {
    setEditingAddOn(addOn);
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingAddOn(undefined);
    setShowEditor(true);
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingAddOn(undefined);
    loadAddOns();
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingAddOn(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading add-ons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add-Ons</h2>
        <p className="text-muted-foreground">{addOns.length} add-ons total</p>
      </div>

      {showEditor ? (
        <div className="bg-card rounded-xl border p-6 max-w-lg">
          <h3 className="font-semibold mb-4">
            {editingAddOn ? "Edit Add-On" : "New Add-On"}
          </h3>
          <AddOnEditor
            addOn={editingAddOn}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <AddOnsList addOns={addOns} onEdit={handleEdit} onNew={handleNew} />
      )}
    </div>
  );
}
