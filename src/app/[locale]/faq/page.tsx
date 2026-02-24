"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {
  CreditCard,
  Calendar,
  Shield,
  Cloud,
  Users,
  Clock,
  Fish,
  Package,
  HelpCircle,
  MessageCircle
} from "lucide-react";

const faqCategories = [
  {
    icon: CreditCard,
    titleKey: "faq.booking",
    questions: [
      {
        question: "How do I book a fishing trip?",
        answer: "You can book a trip directly through our website by selecting your preferred trip, date, and number of participants. You can also contact us via phone or email for assistance with your booking."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Payment can be made online during booking or on the day of the trip."
      },
      {
        question: "Can I modify or cancel my booking?",
        answer: "Yes, you can modify or cancel your booking up to 24 hours before the scheduled trip for a full refund. Cancellations within 24 hours may be subject to a cancellation fee."
      },
      {
        question: "Do you offer group discounts?",
        answer: "Yes, we offer special rates for groups of 4 or more people. Contact us directly for group booking discounts and custom packages."
      },
    ]
  },
  {
    icon: Fish,
    titleKey: "faq.trips",
    questions: [
      {
        question: "What fishing techniques do you use?",
        answer: "We use various techniques including trolling, bottom fishing, and spinning. Captain Nikos will choose the best technique based on the season, weather conditions, and target species."
      },
      {
        question: "What fish can we catch?",
        answer: "The Amvrakikos Gulf is home to various species including Sea Bass, Sea Bream, Red Mullet, Swordfish, and Tuna. The catch varies by season."
      },
      {
        question: "Do I need fishing experience?",
        answer: "No prior fishing experience is required! Captain Nikos provides full instruction and guidance throughout the trip. Beginners are welcome and often catch their first fish with us."
      },
      {
        question: "What happens with our catch?",
        answer: "You can keep your catch (within legal limits) and we can clean and prepare it for you. Alternatively, we can release it back to the sea. Some local restaurants will also cook your catch for you!"
      },
    ]
  },
  {
    icon: Shield,
    titleKey: "faq.safety",
    questions: [
      {
        question: "Is fishing equipment provided?",
        answer: "Yes, all fishing equipment including rods, reels, bait, and tackle is provided. We use high-quality gear suitable for both beginners and experienced anglers."
      },
      {
        question: "What safety measures are in place?",
        answer: "Our boat is equipped with life jackets for all passengers, first aid kit, radio communication, GPS navigation, and all required safety equipment. Captain Nikos is trained in first aid and emergency procedures."
      },
      {
        question: "Are children welcome?",
        answer: "Absolutely! Children of all ages are welcome. We have life jackets in all sizes and can make the trip extra special for young anglers. Children under 12 must be accompanied by an adult."
      },
      {
        question: "Is the boat accessible?",
        answer: "Our boat has easy boarding access. Please contact us in advance if you have any mobility concerns so we can ensure the best experience for you."
      },
    ]
  },
  {
    icon: Cloud,
    titleKey: "faq.weather",
    questions: [
      {
        question: "What happens if the weather is bad?",
        answer: "Safety is our priority. If weather conditions are unsafe, we will reschedule your trip at no extra cost. We monitor weather forecasts closely and will notify you in advance."
      },
      {
        question: "What should I bring?",
        answer: "We recommend bringing sunscreen, sunglasses, a hat, comfortable clothing, and a camera. We provide all fishing equipment, snacks, and drinks."
      },
      {
        question: "What is the best time of year for fishing?",
        answer: "Fishing is good year-round in Amvrakikos Bay, but different species are more active in different seasons. Spring and autumn are particularly good for Sea Bass and Sea Bream, while summer offers great Tuna fishing."
      },
      {
        question: "Do trips run year-round?",
        answer: "Yes, we operate throughout the year. Each season offers unique fishing opportunities and experiences. Winter trips can be particularly peaceful with fewer tourists."
      },
    ]
  },
];

export default function FAQPage() {
  const t = useTranslations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("faq.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8"
        >
          {faqCategories.map((category, categoryIndex) => (
            <motion.div key={categoryIndex} variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  {t(category.titleKey)}
                </h2>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, index) => (
                  <AccordionItem key={index} value={`${categoryIndex}-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline hover:text-blue-600">
                      <span className="font-medium">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-50 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
              {t("faq.contact")}
            </h2>
            <p className="text-slate-600 mb-6">
              We&apos;re here to help with any questions you might have.
            </p>
            <Link href="/contact">
              <Button className="bg-blue-900 hover:bg-blue-800">
                {t("navigation.contact")}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Quick Response</h3>
            <p className="text-sm text-slate-600">We reply within 24 hours</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Expert Support</h3>
            <p className="text-sm text-slate-600">Direct access to Captain Nikos</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Custom Packages</h3>
            <p className="text-sm text-slate-600">Tailored to your needs</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
