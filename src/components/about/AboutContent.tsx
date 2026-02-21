"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { TeamSection } from "@/components/about/TeamSection";
import { ValuesSection } from "@/components/about/ValuesSection";

export function AboutContent() {
  const t = useTranslations("about");

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
              {t("storyTitle")}
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              {t("storyParagraph1")}
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed">
              {t("storyParagraph2")}
            </p>
            <p className="text-slate-600 leading-relaxed">
              {t("storyParagraph3")}
            </p>
          </div>
          <div className="relative h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80"
              alt={t("storyImageAlt")}
              fill
              className="object-cover"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center mb-20">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
              {t("captainTitle")}
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              {t("captainBio")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{t("captainHighlights.experienceTitle")}</h3>
                <p className="text-slate-600 text-sm">{t("captainHighlights.experienceDesc")}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{t("captainHighlights.familyTitle")}</h3>
                <p className="text-slate-600 text-sm">{t("captainHighlights.familyDesc")}</p>
              </div>
            </div>
          </div>
          <div className="relative h-[320px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80"
              alt={t("captainImageAlt")}
              fill
              className="object-cover"
            />
          </div>
        </section>

        <ValuesSection />
        <TeamSection />
      </div>
    </div>
  );
}
