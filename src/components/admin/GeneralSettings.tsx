"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings } from "lucide-react";

export function GeneralSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Settings saved");
  };

  return (
    <div className="bg-card rounded-xl border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold">General Settings</h3>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <Label>Site Name</Label>
          <Input defaultValue="Amvrakikos Fishing Trips" />
        </div>
        <div className="space-y-2">
          <Label>Contact Email</Label>
          <Input type="email" defaultValue="info@amvrakikos-fishing.gr" />
        </div>
        <div className="space-y-2">
          <Label>Contact Phone</Label>
          <Input defaultValue="+30 26820 00000" />
        </div>
        <div className="space-y-2">
          <Label>Business Address</Label>
          <Input defaultValue="Amvrakikos Bay, Preveza, Greece" />
        </div>
        <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
