"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createTrip, updateTrip, TripFormData } from "@/actions/admin/trips";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Trip } from "@/types";

const tripSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  basePrice: z.coerce.number().min(1, "Price must be greater than 0"),
  maxParticipants: z.coerce.number().min(1).max(50),
  isPremium: z.boolean(),
  isActive: z.boolean(),
});

type TripFormValues = z.infer<typeof tripSchema>;

interface TripEditorProps {
  trip?: Trip;
  locale: string;
}

export function TripEditor({ trip, locale }: TripEditorProps) {
  const router = useRouter();
  const [highlights, setHighlights] = useState<string[]>(trip?.highlights || [""]);
  const [images, setImages] = useState<string[]>(trip?.images || [""]);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: trip?.name || "",
      description: trip?.description || "",
      duration: trip?.duration || "",
      basePrice: trip?.basePrice || 0,
      maxParticipants: trip?.maxParticipants || 6,
      isPremium: trip?.isPremium || false,
      isActive: trip?.isActive ?? true,
    },
  });

  const isPremium = watch("isPremium");
  const isActive = watch("isActive");

  const addHighlight = () => setHighlights([...highlights, ""]);
  const removeHighlight = (i: number) =>
    setHighlights(highlights.filter((_, idx) => idx !== i));
  const updateHighlight = (i: number, value: string) => {
    const updated = [...highlights];
    updated[i] = value;
    setHighlights(updated);
  };

  const addImage = () => setImages([...images, ""]);
  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i));
  const updateImage = (i: number, value: string) => {
    const updated = [...images];
    updated[i] = value;
    setImages(updated);
  };

  const onSubmit = async (values: TripFormValues) => {
    setSaving(true);
    try {
      const data: TripFormData = {
        ...values,
        highlights: highlights.filter((h) => h.trim()),
        images: images.filter((img) => img.trim()),
      };

      if (trip) {
        await updateTrip(trip.id, data);
        toast.success("Trip updated successfully");
      } else {
        await createTrip(data);
        toast.success("Trip created successfully");
      }
      router.push(`/${locale}/admin/trips`);
    } catch (err) {
      toast.error("Failed to save trip");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/${locale}/admin/trips`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h2 className="text-xl font-bold">{trip ? "Edit Trip" : "New Trip"}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Basic Information</h3>

          <div className="space-y-2">
            <Label htmlFor="name">Trip Name *</Label>
            <Input id="name" {...register("name")} placeholder="e.g. Morning Fishing Adventure" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Describe the trip experience..."
              className="w-full min-h-24 rounded-md border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input id="duration" {...register("duration")} placeholder="e.g. 4 hours" />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (€) *</Label>
              <Input
                id="basePrice"
                type="number"
                min={1}
                {...register("basePrice")}
                placeholder="e.g. 80"
              />
              {errors.basePrice && (
                <p className="text-sm text-destructive">{errors.basePrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Max Participants *</Label>
            <Input
              id="maxParticipants"
              type="number"
              min={1}
              max={50}
              {...register("maxParticipants")}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPremium"
                checked={isPremium}
                onCheckedChange={(checked) => setValue("isPremium", !!checked)}
              />
              <Label htmlFor="isPremium">Premium Trip</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", !!checked)}
              />
              <Label htmlFor="isActive">Active (visible to customers)</Label>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Highlights</h3>
            <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add
            </Button>
          </div>
          {highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={h}
                onChange={(e) => updateHighlight(i, e.target.value)}
                placeholder={`Highlight ${i + 1}`}
              />
              {highlights.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHighlight(i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Image URLs</h3>
            <Button type="button" variant="outline" size="sm" onClick={addImage}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter image URLs. Use absolute URLs (https://...) or relative paths (/images/...).
          </p>
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                placeholder={`https://example.com/image-${i + 1}.jpg`}
              />
              {images.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImage(i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? "Saving..." : trip ? "Save Changes" : "Create Trip"}
          </Button>
          <Link href={`/${locale}/admin/trips`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
