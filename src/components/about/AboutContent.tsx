"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Anchor,
  Shield,
  Award,
  Fish,
  Heart,
  Users,
  Star,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";

export function AboutContent() {
  const t = useTranslations();

  const stats = [
    { icon: <Clock className="w-6 h-6" />, value: "20+", label: "Years Experience", color: "blue" },
    { icon: <Users className="w-6 h-6" />, value: "5000+", label: "Happy Guests", color: "teal" },
    { icon: <Star className="w-6 h-6" />, value: "4.9", label: "Average Rating", color: "amber" },
    { icon: <Fish className="w-6 h-6" />, value: "100%", label: "Safety Record", color: "green" },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Passion for Fishing",
      description:
        "We're not just tour operators — we're passionate anglers who love sharing the sport with others.",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: t("about.safety"),
      description: t("about.safetyDesc"),
    },
    {
      icon: <Award className="w-8 h-8 text-amber-500" />,
      title: t("about.experience"),
      description: t("about.experienceDesc"),
    },
    {
      icon: <MapPin className="w-8 h-8 text-teal-500" />,
      title: "Local Expertise",
      description:
        "Born and raised in Preveza, we know Amvrakikos Bay like the back of our hand.",
    },
  ];

  const boatFeatures = [
    "Modern navigation and fish-finding equipment",
    "Life jackets and safety gear for all passengers",
    "Comfortable seating and shade area",
    "Live bait well and fish storage",
    "Restroom facilities on board",
    "First aid kit and emergency equipment",
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("about.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("about.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white rounded-2xl shadow-md"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  stat.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : stat.color === "teal"
                    ? "bg-teal-100 text-teal-600"
                    : stat.color === "amber"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80"
                alt="Captain Nikos"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                    <Anchor className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t("about.captain")}</p>
                    <p className="text-sm text-slate-600">Head Captain</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Meet {t("about.captain")}
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
              {t("about.captainBio")}
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Captain Nikos was born in Preveza and has spent his entire life on the
              waters of Amvrakikos Bay. He holds all required licenses and certifications
              and is dedicated to providing the safest and most enjoyable fishing
              experience possible.
            </p>
            <div className="space-y-3">
              {[
                "Licensed professional fishing guide",
                "First aid and water rescue certified",
                "Member of the Greek Fishing Association",
                "Fluent in Greek, English, and German",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
            {t("about.boat")}
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
            {t("about.boatSpecs")}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&q=80"
                alt="Our fishing boat"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boatFeatures.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-blue-900 rounded-2xl p-12 text-white"
        >
          <h2 className="font-serif text-3xl font-bold mb-4">
            Ready to Experience Amvrakikos?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of happy guests who have experienced the magic of fishing in
            Amvrakikos Bay with Captain Nikos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white px-8">
                {t("navigation.bookNow")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 px-8"
              >
                {t("navigation.contact")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
