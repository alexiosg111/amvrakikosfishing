"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FAQItem } from "./FAQItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  categories?: string[];
}

export function FAQAccordion({ faqs, categories = [] }: FAQAccordionProps) {
  const t = useTranslations();
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const groupedFAQs = useMemo(() => {
    const grouped: Record<string, FAQ[]> = {};
    filteredFAQs.forEach((faq) => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });
    return grouped;
  }, [filteredFAQs]);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const allCategories = ["all", ...categories];

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder={t("faq.searchPlaceholder") || "Search frequently asked questions..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 py-6 text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {allCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === "all" ? t("gallery.all") : t(`faq.${category}`) || category}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-slate-600 text-sm text-center">
        {filteredFAQs.length} {filteredFAQs.length === 1 ? "result" : "results"}
      </p>

      {/* FAQ List */}
      {filteredFAQs.length > 0 ? (
        selectedCategory === "all" && categories.length > 0 ? (
          // Group by category
          Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900 capitalize">
                {t(`faq.${category}`) || category}
              </h3>
              <div className="space-y-3">
                {categoryFaqs.map((faq, index) => (
                  <FAQItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openId === faq.id}
                    onClick={() => toggleItem(faq.id)}
                    index={index}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Flat list
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq.id}
                onClick={() => toggleItem(faq.id)}
                index={index}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">
            {t("faq.noResults") || "No questions found matching your search."}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4"
          >
            {t("gallery.clearFilters") || "Clear Filters"}
          </Button>
        </div>
      )}
    </div>
  );
}
