"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitContactForm } from "@/actions/contact";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  Anchor,
  Facebook,
  Instagram,
  Youtube
} from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: MapPin,
    title: "contact.address",
    value: "contact.location",
    href: null,
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+30 697 123 4567",
    href: "tel:+306971234567",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@amvrakikosfishing.com",
    href: "mailto:info@amvrakikosfishing.com",
  },
];

const businessHours = [
  { day: "Monday - Friday", hours: "08:00 - 20:00" },
  { day: "Saturday", hours: "08:00 - 18:00" },
  { day: "Sunday", hours: "09:00 - 16:00" },
];

export default function ContactPage() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactForm({
        name,
        email,
        phone: phone || undefined,
        message,
      });
      toast.success(t("contact.success"));
      setIsSuccess(true);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-lg">
              <CardContent className="p-6 md:p-8">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                      {t("contact.success")}
                    </h3>
                    <p className="text-slate-600 mb-6">
                      {t("contact.successMessage")}
                    </p>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-base font-semibold">
                          {t("contact.name")} *
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-base font-semibold">
                          {t("contact.email")} *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="mt-2"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-base font-semibold">
                        {t("contact.phone")}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+30 697 123 4567"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-base font-semibold">
                        {t("contact.message")} *
                      </Label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        placeholder="Tell us about your inquiry..."
                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-900 hover:bg-blue-800 py-6 text-lg"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t("contact.send")}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{t(info.title)}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-slate-600">{t(info.value)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    {t("contact.hours")}
                  </h3>
                </div>
                <div className="space-y-3">
                  {businessHours.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.day}</span>
                      <span className="font-semibold text-slate-900">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Booking */}
            <Card className="bg-blue-900 text-white shadow-lg">
              <CardContent className="p-6 text-center">
                <Anchor className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                <h3 className="font-serif text-xl font-bold mb-2">
                  Ready to Book?
                </h3>
                <p className="text-blue-100 text-sm mb-4">
                  Skip the form and book your adventure directly!
                </p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6 text-center">
            Find Us
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] bg-slate-200 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">{t("contact.location")}</p>
              <p className="text-sm text-slate-500">
                Preveza Port, Main Marina
              </p>
              <a
                href="https://maps.google.com/?q=Preveza+Greece"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
