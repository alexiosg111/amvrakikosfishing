"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GalleryImage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface GalleryClientProps {
  images: GalleryImage[];
}

const categories = ["all", "catches", "boat", "scenery", "guests"] as const;

export function GalleryClient({ images }: GalleryClientProps) {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const filteredImages = activeCategory === "all"
    ? images
    : images.filter((img) => img.category === activeCategory);

  const openImage = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const navigateImage = (direction: "prev" | "next") => {
    const newIndex = direction === "prev"
      ? (selectedIndex - 1 + filteredImages.length) % filteredImages.length
      : (selectedIndex + 1) % filteredImages.length;
    setSelectedIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("gallery.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("gallery.subtitle")}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 cursor-pointer transition-all ${
                activeCategory === category
                  ? "bg-blue-900 hover:bg-blue-800"
                  : "hover:bg-slate-100"
              }`}
            >
              {t(`gallery.${category}`)}
            </Badge>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openImage(image, filteredImages.indexOf(image))}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium">{image.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500">No images in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            {selectedImage && (
              <>
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                />
                
                {/* Navigation */}
                {filteredImages.length > 1 && (
                  <div className="flex gap-4 absolute left-4 right-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => navigateImage("prev")}
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto text-white hover:bg-white/20"
                      onClick={() => navigateImage("next")}
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>
                  </div>
                )}
                
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </Button>

                {/* Image info */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">{selectedImage.title}</p>
                  {selectedImage.description && (
                    <p className="text-white/70 text-sm">{selectedImage.description}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
