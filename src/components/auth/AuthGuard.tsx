"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/en" }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated") {
    return null;
  }

  return <>{children}</>;
}
