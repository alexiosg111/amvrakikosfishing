"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GalleryImage } from "@/types";

interface GalleryItemProps {
  image: GalleryImage;
  onSelect: (image: GalleryImage) => void;
}

export function GalleryItem({ image, onSelect }: GalleryItemProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(image)}
      className="group relative w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 break-inside-avoid mb-6"
    >
      <Image
        src={image.imageUrl}
        alt={image.title}
        width={600}
        height={400}
        className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="text-sm uppercase tracking-wide text-blue-200">{image.category}</p>
        <h3 className="text-lg font-semibold">{image.title}</h3>
        {image.description && (
          <p className="text-sm text-blue-100 line-clamp-2">{image.description}</p>
        )}
      </div>
    </motion.button>
  );
}
