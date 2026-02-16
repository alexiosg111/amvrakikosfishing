"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqCategories = [
  { id: "all", label: "All" },
  { id: "booking", label: "Booking & Payment" },
  { id: "trips", label: "Trips & Experience" },
  { id: "safety", label: "Safety & Equipment" },
  { id: "weather", label: "Weather & Cancellations" },
];

export default function FAQPage() {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const faqs = [
    {
      category: "booking",
      question: "How do I make a booking?",
      answer: "You can book a trip directly through our website by selecting your preferred trip, choosing a date, and completing the booking form. Alternatively, you can contact us by phone or email, and we'll be happy to assist you with your reservation.",
    },
    {
      category: "booking",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. Payment is required at the time of booking to secure your reservation.",
    },
    {
      category: "booking",
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify your booking up to 24 hours before your scheduled trip without any penalty. Cancellations made less than 24 hours before the trip will be charged the full amount.",
    },
    {
      category: "booking",
      question: "Do you offer group discounts?",
      answer: "Yes, we offer special rates for groups of 4 or more. Please contact us directly for group booking inquiries and custom packages.",
    },
    {
      category: "trips",
      question: "What should I bring on a fishing trip?",
      answer: "We recommend bringing sunscreen, sunglasses, a hat, comfortable clothing, and a camera. We provide all fishing equipment, bait, and refreshments. You may also want to bring a light jacket, as it can get cool on the water.",
    },
    {
      category: "trips",
      question: "Can beginners join the fishing trips?",
      answer: "Absolutely! Our trips are suitable for all experience levels. Captain Nikos will provide guidance and instruction to help beginners get started and ensure everyone has a great experience.",
    },
    {
      category: "trips",
      question: "What fish can we expect to catch?",
      answer: "Amvrakikos Bay is home to various species including sea bass, sea bream, mullet, and more. Depending on the season and conditions, you may also catch other local species. Captain Nikos knows the best spots for each type of fish.",
    },
    {
      category: "trips",
      question: "Is lunch included in the trip?",
      answer: "Lunch is included in our Full Day and Sunset trips. For half-day trips, we provide refreshments and snacks. You can also add a lunch package as an extra during booking.",
    },
    {
      category: "safety",
      question: "Is fishing experience required?",
      answer: "No prior fishing experience is required. Our trips are designed for both beginners and experienced anglers. Captain Nikos will provide all necessary instructions and guidance.",
    },
    {
      category: "safety",
      question: "What safety measures are in place?",
      answer: "Your safety is our top priority. Our boat is fully equipped with life jackets for all passengers, modern navigation equipment, first aid kits, and communication devices. Captain Nikos is certified and has over 20 years of experience.",
    },
    {
      category: "safety",
      question: "Are children allowed on the trips?",
      answer: "Yes, children are welcome on our trips! We have life jackets in various sizes, and our half-day trips are particularly suitable for families. We recommend children be at least 6 years old.",
    },
    {
      category: "weather",
      question: "What happens if the weather is bad?",
      answer: "We monitor weather conditions closely. If weather conditions are unfavorable, we will contact you to reschedule or cancel the trip. In case of cancellation due to weather, you'll receive a full refund or the option to reschedule.",
    },
    {
      category: "weather",
      question: "Do trips run in rain?",
      answer: " Light rain doesn't usually affect our trips, and the boat has a covered area. However, if there are strong winds or storms, we may need to cancel for safety reasons. We'll always keep you informed.",
    },
    {
      category: "weather",
      question: "What's the best time of year for fishing?",
      answer: "Fishing in Amvrakikos Bay is good year-round, but the best months are typically April through October when the weather is warm and the fish are most active. Each season offers different fishing opportunities.",
    },
  ];

  const filteredFAQs = selectedCategory === "all"
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("faq.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === category.id
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-start gap-3 text-left flex-1">
                      <Badge
                        variant="outline"
                        className="mt-1 capitalize shrink-0"
                      >
                        {faq.category}
                      </Badge>
                      <span className="font-semibold text-slate-900">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0 px-6 pb-4">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-blue-900 to-teal-800 text-white">
            <CardContent className="p-8 md:p-12">
              <h2 className="font-serif text-2xl font-bold mb-4">
                {t("faq.contact")}
              </h2>
              <p className="text-white/90 mb-6">
                Can't find the answer you're looking for? Our team is here to help!
              </p>
              <a href="/contact">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Contact Us
                </button>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
