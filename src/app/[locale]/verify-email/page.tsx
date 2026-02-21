import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";

interface VerifyEmailPageProps {
  params: { locale: string };
  searchParams: { token?: string };
}

export async function generateMetadata({ params: { locale } }: VerifyEmailPageProps): Promise<Metadata> {
  const t = await import(`../../../../messages/${locale}.json`);
  return {
    title: t.default.auth.verifyEmail.title,
    description: t.default.auth.verifyEmail.description,
  };
}

export default function VerifyEmailPage({ 
  params: { locale },
  searchParams 
}: VerifyEmailPageProps) {
  const t = useTranslations("auth");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-center">{t("verifyEmail.title")}</CardTitle>
            <CardDescription className="text-center">
              {t("verifyEmail.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">
                {t("verifyEmail.message")}
              </p>
            </div>
            
            <div className="space-y-2">
              <Link href={`/${locale}/login`}>
                <Button className="w-full">
                  {t("verifyEmail.goToLogin")}
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t("verifyEmail.didNotReceive")}{" "}
                <Link href={`/${locale}/forgot-password`} className="font-medium text-primary hover:text-primary/80">
                  {t("verifyEmail.resendEmail")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
