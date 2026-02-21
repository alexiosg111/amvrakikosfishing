"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { registerUser } from "@/actions/auth";

interface RegisterFormProps {
  redirectTo?: string;
}

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  const passwordStrength = {
    hasMinLength: password && password.length >= 8,
    hasUppercase: password && /[A-Z]/.test(password),
    hasLowercase: password && /[a-z]/.test(password),
    hasNumber: password && /\d/.test(password),
  };

  const isStrongPassword = Object.values(passwordStrength).every(Boolean);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const result = await registerUser(data);

      if (result.success) {
        toast.success(t("register.success"));
        router.push(redirectTo || "/en/login");
      } else {
        toast.error(result.error || t("register.error"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t("register.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("register.title")}</CardTitle>
        <CardDescription>{t("register.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("register.name")}</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              disabled={isLoading}
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("register.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              disabled={isLoading}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("register.password")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
            
            {/* Password strength indicator */}
            {password && (
              <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between text-xs">
                  <span>{t("register.passwordStrength")}</span>
                  <span className={cn(
                    "font-medium",
                    isStrongPassword ? "text-green-600" : "text-orange-600"
                  )}>
                    {isStrongPassword ? t("register.strong") : t("register.weak")}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className={cn("flex items-center gap-2", passwordStrength.hasMinLength ? "text-green-600" : "text-gray-400")}>
                    {passwordStrength.hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {t("register.requirements.length")}
                  </div>
                  <div className={cn("flex items-center gap-2", passwordStrength.hasUppercase ? "text-green-600" : "text-gray-400")}>
                    {passwordStrength.hasUppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {t("register.requirements.uppercase")}
                  </div>
                  <div className={cn("flex items-center gap-2", passwordStrength.hasLowercase ? "text-green-600" : "text-gray-400")}>
                    {passwordStrength.hasLowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {t("register.requirements.lowercase")}
                  </div>
                  <div className={cn("flex items-center gap-2", passwordStrength.hasNumber ? "text-green-600" : "text-gray-400")}>
                    {passwordStrength.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {t("register.requirements.number")}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("register.confirmPassword")}
                disabled={isLoading}
                {...form.register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !isStrongPassword}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("register.submit")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
