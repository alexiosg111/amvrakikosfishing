"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FAQAccordion, FAQItem } from "@/components/faq/FAQAccordion";
import { cn } from "@/lib/utils";

const categories = ["booking", "trips", "payments", "general"] as const;

type FAQCategory = (typeof categories)[number];

export function FAQSection() {
  const t = useTranslations("faq");
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("booking");
  const [searchTerm, setSearchTerm] = useState("");

  const itemsByCategory = useMemo(() => {
    const data: Record<FAQCategory, FAQItem[]> = {
      booking: [
        {
          id: "booking-1",
          question: t("questions.booking.q1"),
          answer: t("questions.booking.a1"),
        },
        {
          id: "booking-2",
          question: t("questions.booking.q2"),
          answer: t("questions.booking.a2"),
        },
      ],
      trips: [
        {
          id: "trips-1",
          question: t("questions.trips.q1"),
          answer: t("questions.trips.a1"),
        },
        {
          id: "trips-2",
          question: t("questions.trips.q2"),
          answer: t("questions.trips.a2"),
        },
      ],
      payments: [
        {
          id: "payments-1",
          question: t("questions.payments.q1"),
          answer: t("questions.payments.a1"),
        },
        {
          id: "payments-2",
          question: t("questions.payments.q2"),
          answer: t("questions.payments.a2"),
        },
      ],
      general: [
        {
          id: "general-1",
          question: t("questions.general.q1"),
          answer: t("questions.general.a1"),
        },
        {
          id: "general-2",
          question: t("questions.general.q2"),
          answer: t("questions.general.a2"),
        },
      ],
    };

    return data;
  }, [t]);

  const filteredItems = useMemo(() => {
    const items = itemsByCategory[activeCategory];
    if (!searchTerm) {
      return items;
    }
    const normalized = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(normalized) ||
        item.answer.toLowerCase().includes(normalized)
    );
  }, [activeCategory, itemsByCategory, searchTerm]);

  return (
    <section className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="focus:outline-none"
              >
                <Badge
                  variant={activeCategory === category ? "default" : "outline"}
                  className={cn(
                    "px-4 py-2 cursor-pointer",
                    activeCategory === category
                      ? "bg-blue-900 hover:bg-blue-800"
                      : "hover:bg-slate-100"
                  )}
                >
                  {t(`categories.${category}`)}
                </Badge>
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center text-slate-500 py-12">{t("empty")}</div>
          ) : (
            <FAQAccordion items={filteredItems} />
          )}

          <div className="text-center mt-10 text-slate-600">
            {t("contactPrompt")}
          </div>
        </div>
      </div>
    </section>
  );
}
