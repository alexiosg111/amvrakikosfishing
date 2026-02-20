"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { getGalleryImages, getGalleryCategories } from "@/actions/gallery";
import { GalleryImage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

export default function GalleryPage() {
  const t = useTranslations();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [allImages, cats] = await Promise.all([
        getGalleryImages(),
        getGalleryCategories(),
      ]);
      setImages(allImages);
      setCategories(cats);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category);
    const filtered = await getGalleryImages(category);
    setImages(filtered);
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      catches: t("gallery.catches"),
      boat: t("gallery.boat"),
      scenery: t("gallery.scenery"),
      guests: t("gallery.guests"),
    };
    return labels[cat] || cat;
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4"
          >
            {t("gallery.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            {t("gallery.subtitle")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          <Badge
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 cursor-pointer text-sm transition-all ${
              activeCategory === "all"
                ? "bg-blue-900 text-white hover:bg-blue-800"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
            }`}
          >
            {t("gallery.all")}
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 cursor-pointer text-sm transition-all ${
                activeCategory === cat
                  ? "bg-blue-900 text-white hover:bg-blue-800"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
              }`}
            >
              {getCategoryLabel(cat)}
            </Badge>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium line-clamp-1">{image.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {images.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-slate-500">No images available in this category.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative w-full" style={{ paddingBottom: "66.67%" }}>
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                />
              </div>
              {(selectedImage.title || selectedImage.description) && (
                <div className="p-4 bg-black text-white">
                  <p className="font-semibold">{selectedImage.title}</p>
                  {selectedImage.description && (
                    <p className="text-sm text-slate-400 mt-1">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
