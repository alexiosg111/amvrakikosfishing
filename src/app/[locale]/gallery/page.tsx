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
    title: t("title"),
  };
}

export default async function GalleryPage() {
  const images = await getGalleryImages();
  const t = await getTranslations();

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("gallery.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("gallery.subtitle")}
          </p>
        </div>

        <Gallery images={images} />
      </div>
    </div>
  );
}
