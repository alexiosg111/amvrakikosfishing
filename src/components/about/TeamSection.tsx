"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

export function TeamSection() {
  const t = useTranslations("about");

  const teamMembers = [
    {
      key: "nikos",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80",
    },
    {
      key: "maria",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80",
    },
    {
      key: "yannis",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
          {t("teamTitle")}
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">{t("teamSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <Card key={member.key} className="overflow-hidden">
            <div className="relative h-56">
              <Image
                src={member.image}
                alt={t(`team.${member.key}.name`)}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {t(`team.${member.key}.name`)}
              </h3>
              <p className="text-sm text-blue-700 mb-3">{t(`team.${member.key}.role`)}</p>
              <p className="text-sm text-slate-600">{t(`team.${member.key}.bio`)}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
