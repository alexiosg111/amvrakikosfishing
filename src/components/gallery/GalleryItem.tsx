"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GalleryImage } from "@/types";
import { Badge } from "@/components/ui/badge";

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}

export function GalleryItem({ image, index, onClick }: GalleryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-lg cursor-pointer bg-slate-100"
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative">
        <Image
          src={image.imageUrl}
          alt={image.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={index < 6 ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-lg">{image.title}</h3>
          {image.description && (
            <p className="text-white/80 text-sm mt-1 line-clamp-2">
              {image.description}
            </p>
          )}
        </div>
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-white/90 text-slate-800 capitalize"
        >
          {image.category}
        </Badge>
      </div>
    </motion.div>
  );
}
