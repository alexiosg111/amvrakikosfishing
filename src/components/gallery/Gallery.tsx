"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { GalleryImage } from "@/types";
import { GalleryItem } from "@/components/gallery/GalleryItem";
import { Lightbox } from "@/components/gallery/Lightbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface GalleryProps {
  images: GalleryImage[];
}

const categories = ["all", "catches", "boat", "scenery"] as const;

export function Gallery({ images }: GalleryProps) {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const matchesCategory = selectedCategory === "all" || image.category === selectedCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        image.title.toLowerCase().includes(query) ||
        (image.description || "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [images, search, selectedCategory]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-blue-900 hover:bg-blue-800" : "border-slate-300"}
              onClick={() => setSelectedCategory(category)}
            >
              {t(`gallery.${category}`)}
            </Button>
          ))}
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("gallery.searchPlaceholder")}
            className="pl-9"
          />
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <p className="text-slate-500">{t("gallery.empty")}</p>
        </div>
      ) : (
        <div className="columns-1 gap-6 sm:columns-2 xl:columns-3">
          {filteredImages.map((image) => (
            <GalleryItem key={image.id} image={image} onSelect={setActiveImage} />
          ))}
        </div>
      )}

      <Lightbox
        image={activeImage}
        open={Boolean(activeImage)}
        onOpenChange={(open) => !open && setActiveImage(null)}
      />
    </div>
  );
}
