import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Metadata } from "next";

interface ForgotPasswordPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: ForgotPasswordPageProps): Promise<Metadata> {
  const t = await import(`../../../../messages/${locale}.json`);
  return {
    title: t.default.auth.forgotPassword.title,
    description: t.default.auth.forgotPassword.description,
  };
}

export default function ForgotPasswordPage({ params: { locale } }: ForgotPasswordPageProps) {
  const t = useTranslations("auth");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t("forgotPassword.heading")}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("forgotPassword.subheading")}
          </p>
        </div>
        
        <ForgotPasswordForm />
        
        <div className="text-center">
          <p className="text-sm">
            <Link href={`/${locale}/login`} className="font-medium text-primary hover:text-primary/80">
              {t("forgotPassword.backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
