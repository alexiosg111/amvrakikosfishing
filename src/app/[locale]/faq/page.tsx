import { FAQSection } from "@/components/faq/FAQSection";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function FAQPage() {
  return <FAQSection />;
}
