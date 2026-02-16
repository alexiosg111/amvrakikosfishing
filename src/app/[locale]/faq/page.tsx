import { FAQAccordion, FAQEntry } from "@/components/faq/FAQAccordion";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("title"),
  };
}

export default async function FAQPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations();

  const faqItems: FAQEntry[] = [
    {
      id: "booking-1",
      category: "booking",
      question: t("faq.items.booking1.question"),
      answer: t("faq.items.booking1.answer"),
    },
    {
      id: "booking-2",
      category: "booking",
      question: t("faq.items.booking2.question"),
      answer: t("faq.items.booking2.answer"),
    },
    {
      id: "trips-1",
      category: "trips",
      question: t("faq.items.trips1.question"),
      answer: t("faq.items.trips1.answer"),
    },
    {
      id: "trips-2",
      category: "trips",
      question: t("faq.items.trips2.question"),
      answer: t("faq.items.trips2.answer"),
    },
    {
      id: "safety-1",
      category: "safety",
      question: t("faq.items.safety1.question"),
      answer: t("faq.items.safety1.answer"),
    },
    {
      id: "safety-2",
      category: "safety",
      question: t("faq.items.safety2.question"),
      answer: t("faq.items.safety2.answer"),
    },
    {
      id: "payment-1",
      category: "payment",
      question: t("faq.items.payment1.question"),
      answer: t("faq.items.payment1.answer"),
    },
    {
      id: "payment-2",
      category: "payment",
      question: t("faq.items.payment2.question"),
      answer: t("faq.items.payment2.answer"),
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 space-y-12">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("faq.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        <FAQAccordion items={faqItems} />

        <div className="rounded-3xl bg-blue-900 p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            {t("faq.contactTitle")}
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {t("faq.contact")}
          </p>
          <Link href={`/${locale}/contact`}>
            <Button className="bg-white text-blue-900 hover:bg-blue-50">
              {t("faq.contactCta")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
