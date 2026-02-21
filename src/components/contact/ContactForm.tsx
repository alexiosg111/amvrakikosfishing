"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { contactFormSchema, ContactFormData } from "@/lib/validations";
import { sendContactMessage } from "@/actions/contact";
import { toast } from "sonner";

export function ContactForm() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await sendContactMessage(data);
      toast.success(t("success"), {
        description: t("successMessage"),
      });
      reset();
    } catch (error) {
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 shadow-lg">
      <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
        {t("formTitle")}
      </h2>
      <p className="text-slate-600 mb-6">{t("formSubtitle")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" {...register("phone")} />
        </div>

        <div>
          <Label htmlFor="message">{t("message")}</Label>
          <textarea
            id="message"
            {...register("message")}
            className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.message && (
            <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("send")}
        </Button>
      </form>
    </Card>
  );
}
