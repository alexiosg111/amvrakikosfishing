"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TripCard } from "@/components/trips/TripCard";
import { Trip } from "@/types";

interface FeaturedTripsProps {
  trips: Trip[];
}

export function FeaturedTrips({ trips }: FeaturedTripsProps) {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("trips.title")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("trips.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {trips.slice(0, 6).map((trip) => (
            <motion.div key={trip.id} variants={itemVariants}>
              <TripCard trip={trip} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
