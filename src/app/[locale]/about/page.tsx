"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Anchor, Shield, Award, Users, Clock, Star, Fish, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("about.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("about.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80"
                alt="Captain Nikos"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">
              {t("about.captain")}
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t("about.captainBio")}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Anchor className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">20+ Years</p>
                  <p className="text-sm text-slate-600">Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">100%</p>
                  <p className="text-sm text-slate-600">Safety Record</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">5000+</p>
                  <p className="text-sm text-slate-600">Happy Guests</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">4.9/5</p>
                  <p className="text-sm text-slate-600">Rating</p>
                </div>
              </div>
            </div>

            <Link href="/booking">
              <Button className="bg-blue-900 hover:bg-blue-800">
                Book Your Adventure
              </Button>
            </Link>
          </motion.div>
        </div>

        <Separator className="my-16" />

        {/* Boat Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">
                {t("about.boat")}
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {t("about.boatSpecs")}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-bold">6 Guests</p>
                    <p className="text-sm text-slate-600">Max Capacity</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Fish className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <p className="font-bold">9 Meters</p>
                    <p className="text-sm text-slate-600">Length</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Anchor className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="font-bold">200 HP</p>
                    <p className="text-sm text-slate-600">Engine</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold">Full Day</p>
                    <p className="text-sm text-slate-600">Duration</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80"
                alt="Our Boat"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </motion.div>

        <Separator className="my-16" />

        {/* Safety Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
              {t("about.safety")}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t("about.safetyDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Life Jackets</h3>
                <p className="text-slate-600">Premium life jackets for all passengers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">GPS Navigation</h3>
                <p className="text-slate-600">Advanced navigation systems for safety</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Certified Crew</h3>
                <p className="text-slate-600">Fully trained and certified professionals</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-blue-900 to-teal-800 text-white p-8 md:p-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Ready for Your Fishing Adventure?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t("about.experienceDesc")}
            </p>
            <Link href="/trips">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg">
                View Our Trips
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
