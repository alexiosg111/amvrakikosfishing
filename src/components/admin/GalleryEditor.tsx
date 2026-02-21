"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createGalleryImage,
  updateGalleryImage,
  GalleryImageFormData,
} from "@/actions/admin/gallery";
import { toast } from "sonner";
import { GalleryImage } from "@/types";

const gallerySchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  category: z.enum(["catches", "boat", "scenery", "guests"]),
  isActive: z.boolean(),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

interface GalleryEditorProps {
  image?: GalleryImage;
  onSave: () => void;
  onCancel: () => void;
}

export function GalleryEditor({ image, onSave, onCancel }: GalleryEditorProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: image?.title || "",
      description: image?.description || "",
      imageUrl: image?.imageUrl || "",
      category: image?.category || "catches",
      isActive: image?.isActive ?? true,
    },
  });

  const category = watch("category");
  const isActive = watch("isActive");
  const imageUrl = watch("imageUrl");

  const onSubmit = async (values: GalleryFormValues) => {
    try {
      const data: GalleryImageFormData = {
        title: values.title,
        description: values.description,
        imageUrl: values.imageUrl,
        category: values.category,
        isActive: values.isActive,
      };

      if (image) {
        await updateGalleryImage(image.id, data);
        toast.success("Image updated");
      } else {
        await createGalleryImage(data);
        toast.success("Image added");
      }
      onSave();
    } catch {
      toast.error("Failed to save image");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input {...register("title")} placeholder="Image title" />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input {...register("description")} placeholder="Optional description" />
      </div>

      <div className="space-y-2">
        <Label>Image URL *</Label>
        <Input {...register("imageUrl")} placeholder="https://..." />
        {errors.imageUrl && (
          <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
        )}
        {imageUrl && (
          <div className="mt-2 rounded-md overflow-hidden aspect-video bg-muted w-48">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Category *</Label>
        <Select
          value={category}
          onValueChange={(v) => setValue("category", v as GalleryFormValues["category"])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="catches">Catches</SelectItem>
            <SelectItem value="boat">The Boat</SelectItem>
            <SelectItem value="scenery">Scenery</SelectItem>
            <SelectItem value="guests">Guests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue("isActive", !!checked)}
        />
        <Label htmlFor="isActive">Active (visible on gallery page)</Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Saving..." : image ? "Save Changes" : "Add Image"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
