"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  label: string;
  items: FAQItem[];
}

export default function FAQPage() {
  const t = useTranslations();
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqCategories: FAQCategory[] = [
    {
      label: t("faq.booking"),
      items: [
        {
          question: "How do I book a fishing trip?",
          answer:
            "You can book directly through our website by clicking 'Book Now', selecting your preferred trip, date, and number of participants, then completing the payment online. You can also contact us by phone or email for assistance.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure Stripe payment gateway. Cash payments can also be arranged for local bookings.",
        },
        {
          question: "Can I book for a large group?",
          answer:
            "Each trip has a maximum number of participants listed. For groups larger than the standard limit, we recommend our Private Charter option, which can accommodate up to 6 guests and can be fully customized.",
        },
        {
          question: "Do you offer gift vouchers?",
          answer:
            "Yes! Gift vouchers make a wonderful present for fishing enthusiasts. Contact us directly to arrange a personalized gift voucher for any of our trips.",
        },
      ],
    },
    {
      label: t("faq.trips"),
      items: [
        {
          question: "Do I need fishing experience?",
          answer:
            "Not at all! Our trips cater to all skill levels from complete beginners to experienced anglers. Captain Nikos and his crew provide full guidance and instruction throughout the trip.",
        },
        {
          question: "Is equipment provided?",
          answer:
            "All essential fishing equipment is provided, including rods, reels, bait, and tackle. You can also upgrade to premium professional equipment as an add-on when booking.",
        },
        {
          question: "What species can we catch?",
          answer:
            "Amvrakikos Bay is home to a rich variety of fish including sea bass (lavraki), mullet (kefalos), sea bream (tsipoura), eel, and more. The catch varies by season and trip type.",
        },
        {
          question: "Can we keep the fish we catch?",
          answer:
            "Absolutely! We provide fish cleaning and packaging so you can take your catch home. Some guests prefer a catch-and-release approach, which is also perfectly fine.",
        },
      ],
    },
    {
      label: t("faq.safety"),
      items: [
        {
          question: "Is fishing safe for children?",
          answer:
            "Yes, our Half Day trip is perfect for families with children. We take extra precautions for younger guests, and children must be accompanied by an adult. Life jackets are available in all sizes.",
        },
        {
          question: "What safety equipment is on the boat?",
          answer:
            "Our boat is fully equipped with life jackets for all passengers, first aid kit, fire extinguisher, distress flares, VHF radio, GPS navigation, and all legally required safety equipment.",
        },
        {
          question: "Is Captain Nikos certified?",
          answer:
            "Yes, Captain Nikos holds all required maritime licenses and certifications. He is also first aid and water rescue certified and undergoes regular safety training.",
        },
      ],
    },
    {
      label: t("faq.weather"),
      items: [
        {
          question: "What happens if the weather is bad?",
          answer:
            "Your safety is our priority. If weather conditions are deemed unsafe, we will contact you to reschedule at no additional cost. We monitor forecasts closely and give at least 24 hours notice when possible.",
        },
        {
          question: "What is your cancellation policy?",
          answer:
            "We offer free cancellation up to 24 hours before your trip. Cancellations within 24 hours may be subject to a 50% charge. Full refunds are provided for weather cancellations initiated by us.",
        },
        {
          question: "What is the best season for fishing?",
          answer:
            "Amvrakikos Bay offers excellent fishing year-round. Spring (April–June) and autumn (September–November) are particularly productive. Summer offers great conditions too with longer daylight and warmer weather.",
        },
      ],
    },
  ];

  const toggleItem = (key: string) => {
    setOpenItem(openItem === key ? null : key);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("faq.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        <div className="space-y-12">
          {faqCategories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="font-serif text-xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-100">
                {category.label}
              </h2>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => {
                  const key = `${catIndex}-${itemIndex}`;
                  const isOpen = openItem === key;

                  return (
                    <div
                      key={itemIndex}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-medium text-slate-900 pr-4">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-blue-50 rounded-2xl p-10"
        >
          <h3 className="font-serif text-2xl font-bold text-slate-900 mb-3">
            {t("faq.contact")}
          </h3>
          <p className="text-slate-600 mb-6">
            Our team is always happy to help with any questions you may have.
          </p>
          <Link href="/contact">
            <Button className="bg-blue-900 hover:bg-blue-800 px-8">
              {t("navigation.contact")}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
