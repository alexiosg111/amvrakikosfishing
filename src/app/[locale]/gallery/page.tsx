import { getTranslations } from "next-intl/server";
import { getGalleryImages, getGalleryCategories } from "@/actions/gallery";
import { Gallery } from "@/components/gallery/Gallery";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "gallery" });
  return {
    title: `${t("title")} | Amvrakikos Fishing Trips`,
    description: t("subtitle"),
  };
}

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const images = await getGalleryImages();
  const categories = await getGalleryCategories();

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-blue-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-blue-100">{t("subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Gallery images={images} categories={categories} />
        </div>
      </section>
    </div>
  );
}
