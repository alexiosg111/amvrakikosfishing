"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

export function MapSection() {
  const t = useTranslations("contact");

  return (
    <Card className="p-6 md:p-8">
      <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
        {t("mapTitle")}
      </h2>
      <p className="text-slate-600 mb-6">{t("mapSubtitle")}</p>
      <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden">
        <iframe
          title={t("mapTitle")}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.250646112641!2d20.75262331538457!3d38.958977979561984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135bb6e84f4d60d9%3A0x7a7a61b43c155e7!2sPreveza%2C%20Greece!5e0!3m2!1sen!2sgr!4v1708420000000"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Card>
  );
}
