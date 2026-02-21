import { getGalleryImages } from "@/actions/gallery";
import { getTranslations } from "next-intl/server";
import { GalleryClient } from "./GalleryClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return {
    title: t("title"),
  };
}

export default async function GalleryPage() {
  const images = await getGalleryImages();
  
  return <GalleryClient images={images} />;
}
