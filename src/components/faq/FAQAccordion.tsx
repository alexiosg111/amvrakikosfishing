"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FAQItem } from "@/components/faq/FAQItem";

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  category: "booking" | "trips" | "safety" | "payment";
}

interface FAQAccordionProps {
  items: FAQEntry[];
}

const categories = ["all", "booking", "trips", "safety", "payment"] as const;

export function FAQAccordion({ items }: FAQAccordionProps) {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [items, search, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-blue-900 hover:bg-blue-800" : "border-slate-300"}
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? t("faq.all") : t(`faq.${category}`)}
            </Button>
          ))}
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("faq.searchPlaceholder")}
            className="pl-9"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <p className="text-slate-500">{t("faq.empty")}</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {filteredItems.map((item) => (
            <FAQItem key={item.id} item={item} />
          ))}
        </Accordion>
      )}
    </div>
  );
}
