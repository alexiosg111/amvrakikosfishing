"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormData } from "@/lib/validations";
import { submitContactForm } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactForm(data);
      setIsSubmitted(true);
      toast.success(t("contact.success"));
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      label: t("contact.address"),
      value: t("contact.location"),
    },
    {
      icon: <Phone className="w-6 h-6 text-blue-600" />,
      label: "Phone",
      value: "+30 697 123 4567",
      href: "tel:+306971234567",
    },
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      label: t("contact.email"),
      value: "info@amvrakikosfishing.com",
      href: "mailto:info@amvrakikosfishing.com",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      label: t("contact.hours"),
      value: "Daily 7:00 AM – 8:00 PM",
    },
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
            {t("contact.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    {info.label}
                  </p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-slate-900 hover:text-blue-600 transition-colors font-medium"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-slate-900 font-medium">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-8 p-6 bg-blue-900 rounded-2xl text-white">
              <h3 className="font-semibold text-lg mb-3">Quick Booking</h3>
              <p className="text-blue-100 text-sm mb-4">
                Ready to book? Go directly to our booking page and secure your spot.
              </p>
              <a href="/booking">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  {t("navigation.bookNow")}
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardContent className="p-6 md:p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900 mb-3">
                      {t("contact.success")}
                    </h3>
                    <p className="text-slate-600 mb-6">
                      {t("contact.successMessage")}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="border-blue-900 text-blue-900 hover:bg-blue-50"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">{t("contact.name")}</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          {...register("name")}
                          className="mt-1"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">{t("contact.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register("email")}
                          className="mt-1"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">{t("contact.phone")}</Label>
                      <Input
                        id="phone"
                        placeholder="+30 69..."
                        {...register("phone")}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">{t("contact.message")}</Label>
                      <textarea
                        id="message"
                        {...register("message")}
                        rows={6}
                        placeholder="Tell us how we can help..."
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-900 hover:bg-blue-800 py-6"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t("contact.send")}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
