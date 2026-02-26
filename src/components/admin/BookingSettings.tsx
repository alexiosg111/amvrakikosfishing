"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";

export function BookingSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Booking settings saved");
  };

  return (
    <div className="bg-card rounded-xl border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <CalendarCheck className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold">Booking Settings</h3>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <Label>Minimum Booking Lead Time (hours)</Label>
          <Input type="number" min={0} defaultValue={24} />
        </div>
        <div className="space-y-2">
          <Label>Default Maximum Participants</Label>
          <Input type="number" min={1} max={50} defaultValue={6} />
        </div>
        <div className="space-y-2">
          <Label>Default Confirmation Message</Label>
          <textarea
            className="w-full min-h-24 rounded-md border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue="Thank you for your booking! We will contact you shortly to confirm your reservation."
          />
        </div>
        <div className="space-y-2">
          <Label>Cancellation Policy</Label>
          <textarea
            className="w-full min-h-16 rounded-md border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue="Free cancellation up to 48 hours before the trip. After that, a 50% fee applies."
          />
        </div>
        <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
