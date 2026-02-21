import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { MapSection } from "@/components/contact/MapSection";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <ContactForm />
          <ContactInfo />
        </div>

        <MapSection />
      </div>
    </div>
  );
}
