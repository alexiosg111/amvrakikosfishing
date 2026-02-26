"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/actions/contact";
import { toast } from "sonner";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Anchor,
  Loader2,
} from "lucide-react";

export function ContactContent() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContactForm(formData);
      toast.success(t("contact.success"), {
        description: t("contact.successMessage"),
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error(t("contact.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t("contact.address"),
      value: t("contact.addressValue"),
    },
    {
      icon: Phone,
      label: t("contact.phoneLabel"),
      value: t("contact.phoneValue"),
    },
    {
      icon: Mail,
      label: t("contact.emailLabel"),
      value: t("contact.emailValue"),
    },
    {
      icon: Clock,
      label: t("contact.hours"),
      value: t("contact.hoursValue"),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("contact.formTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("contact.name")} *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t("contact.namePlaceholder")}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("contact.email")} *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("contact.emailPlaceholder")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("contact.phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t("contact.phonePlaceholder")}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("contact.message")} *</Label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={t("contact.messagePlaceholder")}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("contact.sending")}
                  </>
                ) : (
                  t("contact.send")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("contact.info")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 mb-1">{info.label}</p>
                    <p className="text-slate-600">{info.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="relative h-64 bg-slate-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-900">{t("contact.map")}</p>
                    <p className="text-sm text-slate-600 mt-1">{t("contact.location")}</p>
                  </div>
                </div>
                {/* Placeholder for actual map implementation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-blue-900 rounded-2xl p-8 text-center text-white"
        >
          <Anchor className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold mb-2">
            Amvrakikos Fishing Trips
          </h3>
          <p className="text-blue-100 mb-4">
            Creating unforgettable fishing memories since 2005
          </p>
          <Link href="/trips">
            <Button variant="secondary" className="bg-white text-blue-900 hover:bg-blue-50">
              {t("trips.title")}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
