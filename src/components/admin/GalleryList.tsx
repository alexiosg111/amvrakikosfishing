"use client";

import { useState } from "react";
import { GalleryImage } from "@/types";
import { Button } from "@/components/ui/button";
import { deleteGalleryImage, toggleGalleryImageStatus } from "@/actions/admin/gallery";
import { toast } from "sonner";
import { Edit, Trash2, Eye, EyeOff, Plus, Image as ImageIcon } from "lucide-react";

interface GalleryListProps {
  images: GalleryImage[];
  onEdit: (image: GalleryImage) => void;
  onNew: () => void;
}

const categoryColors: Record<string, string> = {
  catches: "bg-blue-100 text-blue-700",
  boat: "bg-slate-100 text-slate-700",
  scenery: "bg-green-100 text-green-700",
  guests: "bg-purple-100 text-purple-700",
};

export function GalleryList({ images, onEdit, onNew }: GalleryListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setLoading(id + "-delete");
    try {
      await deleteGalleryImage(id);
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setLoading(null);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setLoading(id + "-toggle");
    try {
      await toggleGalleryImageStatus(id, !isActive);
      toast.success(`Image ${!isActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update image");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={onNew}>
          <Plus className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No images found
          </div>
        )}
        {images.map((image) => (
          <div
            key={image.id}
            className={`bg-card rounded-xl border overflow-hidden ${
              !image.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="aspect-video bg-muted relative flex items-center justify-center">
              {image.imageUrl ? (
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
              <div className="absolute top-2 left-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    categoryColors[image.category] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {image.category}
                </span>
              </div>
            </div>

            <div className="p-3 space-y-2">
              <p className="font-medium text-sm truncate">{image.title}</p>
              {image.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {image.description}
                </p>
              )}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(image)}
                >
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={loading === image.id + "-toggle"}
                  onClick={() => handleToggle(image.id, image.isActive)}
                >
                  {image.isActive ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive ml-auto"
                  disabled={loading === image.id + "-delete"}
                  onClick={() => handleDelete(image.id, image.title)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
