"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

interface VoucherInputProps {
  onApply: (code: string) => void;
}

export function VoucherInput({ onApply }: VoucherInputProps) {
  const t = useTranslations();
  const [code, setCode] = useState("");

  const handleApply = () => {
    if (code.trim()) {
      onApply(code.trim());
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder={t("booking.voucherCode")}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
        />
      </div>
      <Button type="button" variant="outline" onClick={handleApply}>
        {t("booking.apply")}
      </Button>
    </div>
  );
}
