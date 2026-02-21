"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export function ContactInfo() {
  const t = useTranslations("contact");

  const items = [
    {
      title: t("address"),
      description: t("location"),
      icon: MapPin,
    },
    {
      title: t("phoneLabel"),
      description: "+30 697 123 4567",
      icon: Phone,
    },
    {
      title: t("emailLabel"),
      description: "info@amvrakikosfishing.com",
      icon: Mail,
    },
    {
      title: t("hours"),
      description: `${t("hoursWeekdays")} · ${t("hoursWeekend")}`,
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="p-6 flex gap-4 items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">{item.title}</p>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
