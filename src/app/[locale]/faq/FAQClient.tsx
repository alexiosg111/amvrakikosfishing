"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";

const faqItems = [
  { question: "q1", answer: "a1" },
  { question: "q2", answer: "a2" },
  { question: "q3", answer: "a3" },
  { question: "q4", answer: "a4" },
  { question: "q5", answer: "a5" },
  { question: "q6", answer: "a6" },
  { question: "q7", answer: "a7" },
  { question: "q8", answer: "a8" },
];

export function FAQClient() {
  const t = useTranslations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              {t("faq.title")}
            </h1>
            <p className="text-xl text-blue-100">
              {t("faq.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Category Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-medium">
              {t("faq.booking")}
            </div>
            <div className="px-4 py-2 bg-green-100 text-green-900 rounded-full text-sm font-medium">
              {t("faq.trips")}
            </div>
            <div className="px-4 py-2 bg-amber-100 text-amber-900 rounded-full text-sm font-medium">
              {t("faq.safety")}
            </div>
            <div className="px-4 py-2 bg-purple-100 text-purple-900 rounded-full text-sm font-medium">
              {t("faq.weather")}
            </div>
          </div>

          {/* Accordion */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-white rounded-xl border border-slate-200 px-6 data-[state=open]:shadow-lg transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-medium text-lg py-5 hover:no-underline">
                      {t(`faq.${item.question}`)}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pb-5">
                      {t(`faq.${item.answer}`)}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-blue-900" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
              {t("faq.contact")}
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Can't find the answer you're looking for? Feel free to reach out to us directly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-blue-900 hover:bg-blue-800">
                  <Mail className="w-4 h-4 mr-2" />
                  {t("contact.send")}
                </Button>
              </Link>
              <a href="tel:+306912345678">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </Button>
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center gap-2 text-slate-500">
              <MapPin className="w-5 h-5" />
              <span>{t("contact.location")}</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
