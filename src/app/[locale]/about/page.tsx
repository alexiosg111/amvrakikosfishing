import { getTranslations } from "next-intl/server";
import { AboutContent } from "@/components/about/AboutContent";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
