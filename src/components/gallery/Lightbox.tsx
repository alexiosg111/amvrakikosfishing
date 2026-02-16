"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GalleryImage } from "@/types";

interface LightboxProps {
  image: GalleryImage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Lightbox({ image, open, onOpenChange }: LightboxProps) {
  if (!image) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-none bg-slate-900/95 p-0">
        <div className="relative h-[70vh] w-full">
          <Image
            src={image.imageUrl}
            alt={image.title}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="p-6 text-white">
          <p className="text-sm uppercase tracking-wide text-blue-200">{image.category}</p>
          <h3 className="text-2xl font-semibold mb-2">{image.title}</h3>
          {image.description && <p className="text-blue-100">{image.description}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
