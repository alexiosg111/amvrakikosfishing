import { getTranslations } from "next-intl/server";
import { FAQClient } from "./FAQClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("title"),
  };
}

export default function FAQPage() {
  return <FAQClient />;
}
