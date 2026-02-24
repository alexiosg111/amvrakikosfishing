"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

export function AuthButton() {
  const { data: session } = useSession();
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  if (!session) return null;

  return (
    <Link href={`/${locale}/admin`}>
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-blue-900"
      >
        <Shield className="w-4 h-4 mr-1" />
        {t("navigation.admin")}
      </Button>
    </Link>
  );
}
