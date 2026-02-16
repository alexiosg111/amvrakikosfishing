"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GalleryImage } from "@/types";
import { GalleryItem } from "./GalleryItem";
import { Lightbox } from "./Lightbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, LayoutGrid } from "lucide-react";

interface GalleryProps {
  images: GalleryImage[];
  categories: string[];
}

export function Gallery({ images, categories }: GalleryProps) {
  const t = useTranslations("gallery");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [layoutMode, setLayoutMode] = useState<"grid" | "masonry">("grid");

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const matchesCategory =
        selectedCategory === "all" || image.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (image.description &&
          image.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [images, selectedCategory, searchQuery]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const allCategories = ["all", ...categories];

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? t("all") : category}
            </Button>
          ))}
        </div>

        {/* Search and Layout */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder={t("search") || "Search images..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex border rounded-md">
            <Button
              variant={layoutMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayoutMode("grid")}
              className="h-10 w-10"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={layoutMode === "masonry" ? "default" : "ghost"}
              size="icon"
              onClick={() => setLayoutMode("masonry")}
              className="h-10 w-10"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-slate-600 text-sm">
        Showing {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
      </p>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <motion.div
          layout
          className={
            layoutMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
          }
        >
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className={layoutMode === "masonry" ? "break-inside-avoid mb-4" : ""}
            >
              <GalleryItem
                image={image}
                index={index}
                onClick={() => openLightbox(index)}
              />
            </div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">
            {t("noImages") || "No images found matching your criteria."}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4"
          >
            {t("clearFilters") || "Clear Filters"}
          </Button>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrev={goToPrev}
      />
    </div>
  );
}
