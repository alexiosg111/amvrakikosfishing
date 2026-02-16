"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Anchor, Award, ShieldCheck, Users, Waves } from "lucide-react";

const crew = [
  {
    name: "Captain Nikos",
    role: "Founder & Lead Captain",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
  },
  {
    name: "Eleni Vlahou",
    role: "First Mate",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80",
  },
  {
    name: "Giorgos Pappas",
    role: "Deckhand & Guide",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80",
  },
];

const certifications = [
  {
    title: "Hellenic Coast Guard Certified",
    detail: "Annual vessel inspection and safety compliance",
    icon: ShieldCheck,
  },
  {
    title: "First Aid & Rescue Training",
    detail: "Crew certified in marine first aid",
    icon: Award,
  },
  {
    title: "Modern Navigation Systems",
    detail: "Radar, GPS, and emergency beacon on board",
    icon: Anchor,
  },
];

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 space-y-20">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("about.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
              {t("about.captain")}
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {t("about.captainBio")}
            </p>
            <p className="text-slate-600 leading-relaxed">
              {t("about.mission")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[420px] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80"
                alt="Captain Nikos"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative h-[380px] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80"
                alt="Fishing boat"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
              {t("about.boat")}
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {t("about.boatSpecs")}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Length", value: "9.5m" },
                { label: "Capacity", value: "6 guests" },
                { label: "Engines", value: "Twin 250HP" },
                { label: "Equipment", value: "Live bait wells" },
              ].map((spec) => (
                <div key={spec.label} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{spec.label}</p>
                  <p className="font-semibold text-slate-900">{spec.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {t("about.safety")}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t("about.safetyDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <item.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {t("about.team")}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t("about.teamDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crew.map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-slate-50 p-6 text-center"
              >
                <div className="relative h-40 w-40 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold text-slate-900">{member.name}</h3>
                <p className="text-sm text-slate-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-blue-900 text-white p-10 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Waves className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("about.history")}</h3>
              <p className="text-blue-100">{t("about.historyDesc")}</p>
            </div>
            <div>
              <Users className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("about.missionTitle")}</h3>
              <p className="text-blue-100">{t("about.missionDetail")}</p>
            </div>
            <div>
              <Anchor className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("about.values")}</h3>
              <p className="text-blue-100">{t("about.valuesDesc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
