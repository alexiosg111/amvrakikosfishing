"use client";

import { useTranslations } from "next-intl";
import { AddOnCard } from "@/components/addons/AddOnCard";
import { AddOn } from "@/types";
import { Sparkles, TrendingUp } from "lucide-react";

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOns: { addOnId: string; quantity: number }[];
  onToggle: (addOnId: string, quantity: number) => void;
  tripType?: string;
}

export function AddOnSelector({ addOns, selectedAddOns, onToggle, tripType }: AddOnSelectorProps) {
  const t = useTranslations();

  const getQuantity = (addOnId: string) => {
    const item = selectedAddOns.find((a) => a.addOnId === addOnId);
    return item?.quantity || 0;
  };

  const handleQuantityChange = (addOnId: string, quantity: number) => {
    onToggle(addOnId, quantity);
  };

  // Determine popular and best value add-ons
  const popularAddOns = ["PHOTO", "FOOD"];
  const bestValueAddOns = ["PREMIUM", "PHOTO"];

  // Get recommended add-ons based on trip type
  const getRecommendedAddOns = () => {
    if (!tripType) return [];

    const recommendations: Record<string, string[]> = {
      "Full Day Deep Sea Expedition": ["FOOD", "PHOTO", "EQUIPMENT"],
      "Sunset Fishing & Dinner Cruise": ["PHOTO", "PREMIUM"],
      "Private Charter Experience": ["FOOD", "TRANSPORT", "PHOTO"],
      "Night Fishing Adventure": ["EQUIPMENT", "FOOD"],
      default: ["PHOTO", "FOOD"],
    };

    return recommendations[tripType] || recommendations.default;
  };

  const recommendedAddOns = getRecommendedAddOns();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {t("addOns.title") || "Enhance Your Experience"}
        </h3>
        <p className="text-slate-500 mb-4">{t("addOns.subtitle") || "Choose add-ons to make your trip unforgettable"}</p>
      </div>

      {/* Psychological Triggers */}
      <div className="space-y-3">
        {recommendedAddOns.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900">Recommended for your trip</span>
            </div>
            <p className="text-sm text-slate-600">
              Based on your selection, we recommend these popular add-ons
            </p>
          </div>
        )}

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-slate-900">Most guests choose the Photo Package</span>
          </div>
          <p className="text-sm text-slate-600">
            85% of our guests add the Photo Package to capture their memories
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <span className="font-semibold text-slate-900">Save €15 with our Sunset Extension</span>
              <p className="text-sm text-slate-600 mt-1">
                Extend your trip by 2 hours and enjoy exclusive sunset views with complimentary drinks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add-ons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addOns.map((addOn) => {
          const quantity = getQuantity(addOn.id);
          const isPopular = popularAddOns.includes(addOn.category);
          const isBestValue = bestValueAddOns.includes(addOn.category);
          const isRecommended = recommendedAddOns.includes(addOn.category);

          return (
            <AddOnCard
              key={addOn.id}
              addOn={addOn}
              quantity={quantity}
              onQuantityChange={(qty) => handleQuantityChange(addOn.id, qty)}
              isPopular={isPopular}
              isBestValue={isBestValue}
            />
          );
        })}
      </div>

      {/* Additional Tips */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">💡 Tip:</span> You can modify add-ons at any time before completing your booking
        </p>
      </div>
    </div>
  );
}
