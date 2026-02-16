"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddOn } from "@/types";
import { Utensils, Camera, Car, Wrench, Sun, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOns: { addOnId: string; quantity: number }[];
  onToggle: (addOnId: string, quantity: number) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  FOOD: <Utensils className="w-5 h-5" />,
  PHOTO: <Camera className="w-5 h-5" />,
  TRANSPORT: <Car className="w-5 h-5" />,
  EQUIPMENT: <Wrench className="w-5 h-5" />,
  PREMIUM: <Sun className="w-5 h-5" />,
  GENERAL: <Star className="w-5 h-5" />,
};

export function AddOnSelector({ addOns, selectedAddOns, onToggle }: AddOnSelectorProps) {
  const t = useTranslations();

  const getQuantity = (addOnId: string) => {
    const item = selectedAddOns.find((a) => a.addOnId === addOnId);
    return item?.quantity || 0;
  };

  const handleQuantityChange = (addOnId: string, delta: number) => {
    const currentQty = getQuantity(addOnId);
    const newQty = Math.max(0, currentQty + delta);
    onToggle(addOnId, newQty);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{t("addOns.title")}</h3>
        <p className="text-slate-500 mb-6">{t("addOns.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addOns.map((addOn) => {
          const quantity = getQuantity(addOn.id);
          const isSelected = quantity > 0;

          return (
            <Card
              key={addOn.id}
              className={`transition-all ${
                isSelected ? "border-blue-500 ring-1 ring-blue-500" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                    {categoryIcons[addOn.category] || categoryIcons.GENERAL}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{addOn.name}</h4>
                      {addOn.category === "PHOTO" && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                          {t("addOns.mostGuests")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {addOn.description}
                    </p>
                    <p className="font-bold text-blue-600 mt-2">
                      {formatPrice(addOn.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleQuantityChange(addOn.id, -1)}
                      disabled={quantity === 0}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center font-semibold">{quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleQuantityChange(addOn.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
