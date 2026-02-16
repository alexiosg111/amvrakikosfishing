"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Review } from "@/types";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface TestimonialsPreviewProps {
  reviews: Review[];
}

export function TestimonialsPreview({ reviews }: TestimonialsPreviewProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-400/30" />
              
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-400"
                    }`}
                  />
                ))}
              </div>

              <p className="text-blue-100 mb-6 line-clamp-4">
                &ldquo;{review.comment || t("testimonials.noComment")}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-amber-500 text-white">
                    {review.userId.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{review.userId}</p>
                  {review.isVerified && (
                    <p className="text-xs text-blue-300">
                      {t("testimonials.verified")}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href={`/${locale}/testimonials`}>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-900"
            >
              {t("testimonials.writeReview")}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
