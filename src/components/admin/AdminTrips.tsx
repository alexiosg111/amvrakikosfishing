"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Eye, EyeOff, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function AdminTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    basePrice: "",
    maxParticipants: "",
    images: "",
    highlights: "",
    isPremium: false,
  });

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const res = await fetch("/api/admin/trips");
      const data = await res.json();
      setTrips(data);
    } catch {
      toast.error("Failed to load trips");
    } finally {
      setIsLoading(false);
    }
  }

  const openEdit = (trip: any) => {
    setEditingTrip(trip);
    setFormData({
      name: trip.name,
      description: trip.description,
      duration: trip.duration,
      basePrice: String(trip.basePrice),
      maxParticipants: String(trip.maxParticipants),
      images: trip.images.join("\n"),
      highlights: trip.highlights.join("\n"),
      isPremium: trip.isPremium,
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditingTrip(null);
    setFormData({
      name: "",
      description: "",
      duration: "",
      basePrice: "",
      maxParticipants: "",
      images: "",
      highlights: "",
      isPremium: false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      basePrice: parseInt(formData.basePrice),
      maxParticipants: parseInt(formData.maxParticipants),
      images: formData.images.split("\n").filter(Boolean),
      highlights: formData.highlights.split("\n").filter(Boolean),
      isPremium: formData.isPremium,
    };

    try {
      if (editingTrip) {
        const res = await fetch("/api/admin/trips", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingTrip.id, ...payload }),
        });
        if (res.ok) {
          toast.success("Trip updated");
          await loadTrips();
          setShowForm(false);
        }
      } else {
        const res = await fetch("/api/admin/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Trip created");
          await loadTrips();
          setShowForm(false);
        }
      }
    } catch {
      toast.error("Failed to save trip");
    }
  };

  const toggleActive = async (trip: any) => {
    try {
      const res = await fetch("/api/admin/trips", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: trip.id, isActive: !trip.isActive }),
      });
      if (res.ok) {
        setTrips((prev) =>
          prev.map((t) => (t.id === trip.id ? { ...t, isActive: !t.isActive } : t))
        );
        toast.success(trip.isActive ? "Trip hidden" : "Trip visible");
      }
    } catch {
      toast.error("Failed to update trip");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trips</h1>
          <p className="text-slate-500 mt-1">{trips.length} trips</p>
        </div>
        <Button onClick={openNew} className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          New Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <Card key={trip.id} className={!trip.isActive ? "opacity-60" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">{trip.name}</h3>
                    {trip.isPremium && (
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{trip.duration}h · Max {trip.maxParticipants} guests</p>
                </div>
                <p className="font-bold text-blue-900 ml-2">{formatPrice(trip.basePrice)}</p>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 mb-4">{trip.description}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(trip)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(trip)}
                  className={`flex-1 ${!trip.isActive ? "text-green-600" : "text-slate-500"}`}
                >
                  {trip.isActive ? (
                    <><EyeOff className="w-3 h-3 mr-1" />Hide</>
                  ) : (
                    <><Eye className="w-3 h-3 mr-1" />Show</>
                  )}
                </Button>
              </div>
              <div className="flex gap-2 mt-2 text-xs text-slate-500">
                <span>{trip._count?.bookings || 0} bookings</span>
                <span>·</span>
                <span>{trip._count?.reviews || 0} reviews</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTrip ? "Edit Trip" : "New Trip"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Trip Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                required
                rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="basePrice">Base Price (€)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData((p) => ({ ...p, basePrice: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData((p) => ({ ...p, maxParticipants: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="images">Image URLs (one per line)</Label>
              <textarea
                id="images"
                value={formData.images}
                onChange={(e) => setFormData((p) => ({ ...p, images: e.target.value }))}
                rows={3}
                placeholder="https://..."
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <Label htmlFor="highlights">Highlights (one per line)</Label>
              <textarea
                id="highlights"
                value={formData.highlights}
                onChange={(e) => setFormData((p) => ({ ...p, highlights: e.target.value }))}
                rows={4}
                placeholder="Equipment provided&#10;Expert guidance..."
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isPremium"
                type="checkbox"
                checked={formData.isPremium}
                onChange={(e) => setFormData((p) => ({ ...p, isPremium: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isPremium">Premium Trip</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-800">
                {editingTrip ? "Save Changes" : "Create Trip"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
