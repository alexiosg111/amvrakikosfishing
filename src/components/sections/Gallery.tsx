"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GalleryImage } from "@/types";
import Image from "next/image";
import { Maximize2, Camera, Anchor, Waves, Users } from "lucide-react";

interface GalleryProps {
  initialImages: GalleryImage[];
  categories: string[];
  initialCategory: string;
}

const categoryIcons: Record<string, any> = {
  catches: Camera,
  boat: Anchor,
  scenery: Waves,
  guests: Users,
};

export function Gallery({ initialImages, categories, initialCategory }: GalleryProps) {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [images, setImages] = useState(initialImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);

    // In a real app, you might fetch from server here
    // For now, filter client-side
    if (category === 'all') {
      setImages(initialImages);
    } else {
      setImages(initialImages.filter(img => img.category === category));
    }
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Badge
          variant={selectedCategory === 'all' ? "default" : "outline"}
          className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors ${
            selectedCategory === 'all' ? 'bg-blue-900 hover:bg-blue-800' : 'hover:bg-slate-100'
          }`}
          onClick={() => handleCategoryChange('all')}
        >
          {t("gallery.all")}
        </Badge>
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          return (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors ${
                selectedCategory === category ? 'bg-blue-900 hover:bg-blue-800' : 'hover:bg-slate-100'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {Icon && <Icon className="w-4 h-4 mr-1 inline" />}
              {t(`gallery.${category}`)}
            </Badge>
          );
        })}
      </div>

      {/* Gallery grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.imageUrl}
                alt={image.title || image.category}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-semibold text-sm">{image.title}</p>
                {image.description && (
                  <p className="text-xs text-white/80 mt-1">{image.description}</p>
                )}
              </div>
              <Dialog open={selectedImage?.id === image.id} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                    }}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={image.imageUrl}
                      alt={image.title || image.category}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                      <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                      {image.description && (
                        <p className="text-white/80 text-sm mt-1">{image.description}</p>
                      )}
                      <Badge variant="secondary" className="mt-2">
                        {t(`gallery.${image.category}`)}
                      </Badge>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Camera className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">{t("gallery.noImages")}</p>
        </div>
      )}
    </div>
  );
}
