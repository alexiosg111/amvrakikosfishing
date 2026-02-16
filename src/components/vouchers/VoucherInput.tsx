"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Tag, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface VoucherInputProps {
  onApply: (code: string) => Promise<{ valid: boolean; discount: number; message: string }>;
}

type VoucherStatus = "idle" | "loading" | "success" | "error";

export function VoucherInput({ onApply }: VoucherInputProps) {
  const t = useTranslations();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<VoucherStatus>("idle");
  const [message, setMessage] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApply = async () => {
    if (!code.trim()) return;

    setStatus("loading");
    try {
      const result = await onApply(code.trim());
      setStatus(result.valid ? "success" : "error");
      setMessage(result.message);
      setDiscount(result.discount);
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred");
    }
  };

  const handleClear = () => {
    setCode("");
    setStatus("idle");
    setMessage("");
    setDiscount(0);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={t("booking.voucherCode") || "Promo code"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`pl-10 ${status === "error" ? "border-red-500 focus-visible:ring-red-500" : ""} ${
              status === "success" ? "border-green-500 focus-visible:ring-green-500" : ""
            }`}
            disabled={status === "loading" || status === "success"}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
          <AnimatePresence>
            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}
            {status === "success" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={status === "loading" || status === "success" || !code.trim()}
        >
          {status === "loading" ? "..." : t("booking.apply") || "Apply"}
        </Button>
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900 flex items-center gap-1">
                    <Gift className="w-4 h-4" />
                    Voucher Applied!
                  </p>
                  <p className="text-sm text-green-700 mt-0.5">
                    {message} (You save {formatPrice(discount)})
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900">Invalid Voucher</p>
                  <p className="text-sm text-red-700 mt-0.5">{message}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
