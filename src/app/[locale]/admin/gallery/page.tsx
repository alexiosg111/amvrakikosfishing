"use client";

import { useState, useEffect } from "react";
import { GalleryImage } from "@/types";
import { getAllGalleryImages } from "@/actions/admin/gallery";
import { GalleryList } from "@/components/admin/GalleryList";
import { GalleryEditor } from "@/components/admin/GalleryEditor";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [editingImage, setEditingImage] = useState<GalleryImage | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadImages = async () => {
    setLoading(true);
    const data = await getAllGalleryImages();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingImage(undefined);
    setShowEditor(true);
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingImage(undefined);
    loadImages();
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingImage(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gallery</h2>
        <p className="text-muted-foreground">{images.length} images total</p>
      </div>

      {showEditor ? (
        <div className="bg-card rounded-xl border p-6 max-w-lg">
          <h3 className="font-semibold mb-4">
            {editingImage ? "Edit Image" : "Add Image"}
          </h3>
          <GalleryEditor
            image={editingImage}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <GalleryList images={images} onEdit={handleEdit} onNew={handleNew} />
      )}
    </div>
  );
}
