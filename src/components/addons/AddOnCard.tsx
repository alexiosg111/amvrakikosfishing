"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddOn } from "@/types";
import { Utensils, Camera, Car, Wrench, Sun, Star, Flame, Award } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AddOnCardProps {
  addOn: AddOn;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  isPopular?: boolean;
  isBestValue?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  FOOD: <Utensils className="w-5 h-5" />,
  PHOTO: <Camera className="w-5 h-5" />,
  TRANSPORT: <Car className="w-5 h-5" />,
  EQUIPMENT: <Wrench className="w-5 h-5" />,
  PREMIUM: <Sun className="w-5 h-5" />,
  GENERAL: <Star className="w-5 h-5" />,
};

export function AddOnCard({ addOn, quantity, onQuantityChange, isPopular, isBestValue }: AddOnCardProps) {
  const isSelected = quantity > 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        className={`transition-all cursor-pointer overflow-hidden ${
          isSelected ? "border-blue-500 ring-2 ring-blue-500/20" : "hover:border-blue-300"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
              }`}
            >
              {categoryIcons[addOn.category] || categoryIcons.GENERAL}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header with badges */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-slate-900">{addOn.name}</h4>
                  {isPopular && (
                    <Badge className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-100">
                      <Flame className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {isBestValue && (
                    <Badge className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      <Award className="w-3 h-3 mr-1" />
                      Best Value
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-500 line-clamp-2 mb-2">{addOn.description}</p>

              <div className="flex items-center justify-between">
                <p className={`font-bold ${isSelected ? "text-blue-600" : "text-slate-900"}`}>
                  {formatPrice(addOn.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                  <Button
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => onQuantityChange(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
