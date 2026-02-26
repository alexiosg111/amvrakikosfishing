"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export function FAQContent() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = [
    {
      category: "faq.categories.booking",
      questions: [
        { q: "faq.questions.q1", a: "faq.questions.a1" },
        { q: "faq.questions.q2", a: "faq.questions.a2" },
      ],
    },
    {
      category: "faq.categories.trips",
      questions: [
        { q: "faq.questions.q3", a: "faq.questions.a3" },
        { q: "faq.questions.q4", a: "faq.questions.a4" },
        { q: "faq.questions.q6", a: "faq.questions.a6" },
        { q: "faq.questions.q7", a: "faq.questions.a7" },
        { q: "faq.questions.q8", a: "faq.questions.a8" },
      ],
    },
    {
      category: "faq.categories.safety",
      questions: [
        { q: "faq.questions.q4", a: "faq.questions.a4" },
      ],
    },
    {
      category: "faq.categories.weather",
      questions: [
        { q: "faq.questions.q5", a: "faq.questions.a5" },
      ],
    },
  ];

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery
    ? faqItems.map((category) => ({
        ...category,
        questions: category.questions.filter(
          (item) =>
            t(item.q).toLowerCase().includes(searchQuery.toLowerCase()) ||
            t(item.a).toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((category) => category.questions.length > 0)
    : faqItems;

  return (
    <div>
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder={t("faq.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>
      </motion.div>

      {/* FAQ Categories */}
      {filteredFAQs.length > 0 ? (
        <div className="space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <div className="mb-4">
                <Badge variant="secondary" className="text-sm font-medium px-4 py-2">
                  {t(category.category)}
                </Badge>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((item, questionIndex) => (
                  <AccordionItem
                    key={item.q}
                    value={item.q}
                    className="border border-slate-200 rounded-lg px-6 bg-white"
                  >
                    <AccordionTrigger className="hover:no-underline text-left text-slate-900 font-medium hover:text-blue-900 transition-colors">
                      {t(item.q)}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed">
                      {t(item.a)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Search className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No results found for "{searchQuery}"</p>
          <p className="text-slate-400 mt-2">Try a different search term</p>
        </motion.div>
      )}

      {/* Contact CTA */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-slate-50 rounded-2xl p-8 text-center"
        >
          <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
            {t("faq.contact")}
          </h3>
          <p className="text-slate-600 mb-6">
            Can't find what you're looking for? Reach out to us directly.
          </p>
          <button
            onClick={() => window.location.href = "/contact"}
            className="inline-flex items-center justify-center rounded-md bg-blue-900 px-6 py-3 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
          >
            {t("navigation.contact")}
          </button>
        </motion.div>
      )}
    </div>
  );
}
