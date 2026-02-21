"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Shield, Anchor, Users } from "lucide-react";
import Link from "next/link";

export function AboutClient() {
  const t = useTranslations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              {t("about.title")}
            </h1>
            <p className="text-xl text-blue-100">
              {t("about.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Captain Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Anchor className="w-32 h-32 text-blue-900/30" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
                {t("about.captain")}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t("about.captainBio")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Boat */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-2xl p-8 shadow-sm h-full">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Anchor className="w-7 h-7 text-blue-900" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">
                  {t("about.boat")}
                </h3>
                <p className="text-slate-600">
                  {t("about.boatSpecs")}
                </p>
              </div>
            </motion.div>

            {/* Safety */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-2xl p-8 shadow-sm h-full">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-green-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">
                  {t("about.safety")}
                </h3>
                <p className="text-slate-600">
                  {t("about.safetyDesc")}
                </p>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-2xl p-8 shadow-sm h-full">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-amber-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">
                  {t("about.experience")}
                </h3>
                <p className="text-slate-600">
                  {t("about.experienceDesc")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
              Ready for Your Adventure?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join us for an unforgettable fishing experience in the beautiful waters of Amvrakikos Bay.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/trips">
                <Button size="lg" className="bg-blue-900 hover:bg-blue-800">
                  {t("trips.viewTrips", "View Our Trips")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  {t("navigation.contact")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
