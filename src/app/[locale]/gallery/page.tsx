import { getGalleryImages } from "@/actions/gallery";
import { Gallery } from "@/components/gallery/Gallery";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "gallery" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return <Gallery images={images} />;
}
