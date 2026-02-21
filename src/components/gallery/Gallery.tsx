"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GalleryImage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GalleryProps {
  images: GalleryImage[];
}

const categoryOrder = ["all", "catches", "boat", "scenery", "guests"] as const;

type GalleryCategory = (typeof categoryOrder)[number];

export function Gallery({ images }: GalleryProps) {
  const t = useTranslations("gallery");
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");

  const categories = useMemo(
    () =>
      categoryOrder.map((category) => ({
        value: category,
        label: t(category),
      })),
    [t]
  );

  const filteredImages = useMemo(() => {
    if (activeCategory === "all") {
      return images;
    }
    return images.filter((image) => image.category === activeCategory);
  }, [activeCategory, images]);

  return (
    <section className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className="focus:outline-none"
            >
              <Badge
                variant={activeCategory === category.value ? "default" : "outline"}
                className={cn(
                  "px-4 py-2 cursor-pointer text-sm",
                  activeCategory === category.value
                    ? "bg-blue-900 hover:bg-blue-800"
                    : "hover:bg-slate-100"
                )}
              >
                {category.label}
              </Badge>
            </button>
          ))}
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            {t("empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-slate-900 mb-1">{image.title}</p>
                  {image.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
