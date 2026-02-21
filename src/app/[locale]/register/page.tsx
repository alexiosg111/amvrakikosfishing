import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Metadata } from "next";

interface RegisterPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: RegisterPageProps): Promise<Metadata> {
  const t = await import(`../../../../messages/${locale}.json`);
  return {
    title: t.default.auth.register.title,
    description: t.default.auth.register.description,
  };
}

export default function RegisterPage({ params: { locale } }: RegisterPageProps) {
  const t = useTranslations("auth");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t("register.heading")}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("register.subheading")}
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            {t("register.hasAccount")}{" "}
            <Link href={`/${locale}/login`} className="font-medium text-primary hover:text-primary/80">
              {t("register.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
