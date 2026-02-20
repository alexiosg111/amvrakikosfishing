"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["catches", "boat", "scenery", "guests"];

export function AdminGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "catches",
  });

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setImages(data);
    } catch {
      toast.error("Failed to load gallery");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Image added to gallery");
        await loadImages();
        setShowForm(false);
        setFormData({ title: "", description: "", imageUrl: "", category: "catches" });
      }
    } catch {
      toast.error("Failed to add image");
    }
  }

  async function toggleActive(image: any) {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: image.id, isActive: !image.isActive }),
      });
      if (res.ok) {
        setImages((prev) =>
          prev.map((img) => (img.id === image.id ? { ...img, isActive: !img.isActive } : img))
        );
        toast.success(image.isActive ? "Image hidden" : "Image shown");
      }
    } catch {
      toast.error("Failed to update image");
    }
  }

  async function deleteImage(id: string) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        toast.success("Image deleted");
      }
    } catch {
      toast.error("Failed to delete image");
    }
  }

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
          <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
          <p className="text-slate-500 mt-1">{images.length} images</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className={`relative group rounded-xl overflow-hidden ${!image.isActive ? "opacity-50" : ""}`}>
            <div className="aspect-square relative">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <p className="text-white text-xs font-medium text-center px-2 line-clamp-2">{image.title}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(image)}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100"
                >
                  {image.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteImage(image.id)}
                  className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="absolute top-2 left-2">
              <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full capitalize">
                {image.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-slate-500">No gallery images yet.</div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Gallery Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                required
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {formData.imageUrl && (
              <div className="relative h-40 rounded-xl overflow-hidden">
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => {}}
                />
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-800">
                Add Image
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
