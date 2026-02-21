"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Anchor, Shield, Sparkles } from "lucide-react";

export function ValuesSection() {
  const t = useTranslations("about");

  const values = [
    {
      key: "heritage",
      icon: Anchor,
    },
    {
      key: "safety",
      icon: Shield,
    },
    {
      key: "moments",
      icon: Sparkles,
    },
  ];

  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
          {t("valuesTitle")}
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">{t("valuesSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <Card key={value.key} className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t(`values.${value.key}.title`)}
              </h3>
              <p className="text-sm text-slate-600">{t(`values.${value.key}.description`)}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
