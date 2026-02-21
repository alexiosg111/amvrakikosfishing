"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ContactFormData } from "@/types";
import { contactFormSchema } from "@/lib/validations";
import { submitContactForm } from "@/actions/contact";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export function ContactClient() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactForm(data);
      toast.success(t("contact.success"));
      reset();
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t("contact.location"),
      value: "Amvrakikos Bay, Preveza, Greece",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+30 697 123 4567",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@amvrakikos-fishing.gr",
    },
    {
      icon: Clock,
      label: t("contact.hours"),
      value: "Mon - Sun: 8:00 AM - 8:00 PM",
    },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              {t("contact.title")}
            </h1>
            <p className="text-xl text-blue-100">
              {t("contact.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">
                    {t("contact.send")}
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="name">{t("contact.name")} *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="John Doe"
                        className="mt-2"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">{t("contact.email")} *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="john@example.com"
                        className="mt-2"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">{t("contact.phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="+30 697 123 4567"
                        className="mt-2"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">{t("contact.message")} *</Label>
                      <Textarea
                        id="message"
                        {...register("message")}
                        placeholder="How can we help you?"
                        rows={5}
                        className="mt-2"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-900 hover:bg-blue-800"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t("contact.send")}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <info.icon className="w-6 h-6 text-blue-900" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{info.label}</p>
                          <p className="text-slate-600">{info.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-blue-900/50 mx-auto mb-2" />
                      <p className="text-blue-900/70 font-medium">
                        Amvrakikos Bay
                      </p>
                      <p className="text-blue-900/50 text-sm">
                        Preveza, Greece
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
