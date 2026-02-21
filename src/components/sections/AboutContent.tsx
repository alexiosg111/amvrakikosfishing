"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Anchor,
  Shield,
  Award,
  Fish,
  Users,
  Leaf,
  Compass,
  Star,
} from "lucide-react";

export function AboutContent() {
  const t = useTranslations();

  const values = [
    {
      icon: Shield,
      title: t("about.value1Title"),
      description: t("about.value1Desc"),
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: Leaf,
      title: t("about.value2Title"),
      description: t("about.value2Desc"),
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Compass,
      title: t("about.value3Title"),
      description: t("about.value3Desc"),
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const teamMembers = [
    {
      name: "Captain Nikos",
      role: "Founder & Captain",
      icon: Anchor,
    },
    {
      name: "First Mate Alex",
      role: "Deck Hand",
      icon: Fish,
    },
    {
      name: "Captain Michalis",
      role: "Senior Guide",
      icon: Star,
    },
  ];

  return (
    <div className="space-y-20">
      {/* Our Story Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">
              {t("about.ourStory")}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              {t("about.storyText")}
            </p>
            <div className="flex gap-8 mt-8">
              <div>
                <p className="text-4xl font-bold text-blue-900 mb-1">20+</p>
                <p className="text-sm text-slate-600">{t("common.hours").replace("hours", "Years")}</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-900 mb-1">5000+</p>
                <p className="text-sm text-slate-600">Happy Guests</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-900 mb-1">4.9</p>
                <p className="text-sm text-slate-600">Rating</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80"
                alt="Fishing boat"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Captain Profile Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-slate-50 -mx-4 px-4 py-16 rounded-3xl"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-white shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
                alt="Captain Nikos"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2 shadow-lg">
              <Anchor className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mb-2">
            {t("about.captain")}
          </h2>
          <p className="text-blue-600 font-semibold mb-4">Founder & Captain</p>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t("about.captainBio")}
          </p>
        </div>
      </motion.section>

      {/* Boat Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80"
                alt="Our Boat"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">
              {t("about.boat")}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              {t("about.boatSpecs")}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="font-semibold text-slate-900">6 Guests</p>
                  <p className="text-sm text-slate-600">Max Capacity</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Anchor className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="font-semibold text-slate-900">36ft</p>
                  <p className="text-sm text-slate-600">Vessel Length</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
            {t("about.team")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("about.teamDesc")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-blue-600 mb-3">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
            {t("about.values")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${value.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-2">{value.title}</h3>
                    <p className="text-slate-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-blue-900 -mx-4 px-4 py-16 rounded-3xl text-center"
      >
        <h2 className="font-serif text-3xl font-bold text-white mb-4">
          Ready to Experience the Adventure?
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          Join us for an unforgettable fishing experience in Amvrakikos Bay
        </p>
        <Link href="/booking">
          <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
            {t("navigation.bookNow")}
          </Button>
        </Link>
      </motion.section>
    </div>
  );
}
