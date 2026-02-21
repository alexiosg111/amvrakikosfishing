import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Metadata } from "next";

interface LoginPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: LoginPageProps): Promise<Metadata> {
  const t = await import(`../../../../messages/${locale}.json`);
  return {
    title: t.default.auth.login.title,
    description: t.default.auth.login.description,
  };
}

export default function LoginPage({ params: { locale } }: LoginPageProps) {
  const t = useTranslations("auth");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t("login.heading")}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("login.subheading")}
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            {t("login.noAccount")}{" "}
            <Link href={`/${locale}/register`} className="font-medium text-primary hover:text-primary/80">
              {t("login.signUp")}
            </Link>
          </p>
          <p className="text-sm">
            <Link href={`/${locale}/forgot-password`} className="font-medium text-primary hover:text-primary/80">
              {t("login.forgotPassword")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
