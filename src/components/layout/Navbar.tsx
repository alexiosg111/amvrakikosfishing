"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { Menu, X, Anchor } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'en';

  const navItems = [
    { href: `/${locale}`, label: t("navigation.home") },
    { href: `/${locale}/trips`, label: t("navigation.trips") },
    { href: `/${locale}/gallery`, label: t("navigation.gallery") },
    { href: `/${locale}/testimonials`, label: t("navigation.testimonials") },
    { href: `/${locale}/about`, label: t("navigation.about") },
    { href: `/${locale}/faq`, label: t("navigation.faq") },
    { href: `/${locale}/contact`, label: t("navigation.contact") },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-blue-900">
              Amvrakikos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`relative ${
                    isActive(item.href)
                      ? "text-blue-900 font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-900 rounded-full"
                    />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            
            <Link href={`/${locale}/booking`} className="hidden sm:block">
              <Button className="bg-blue-900 hover:bg-blue-800">
                {t("navigation.bookNow")}
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  <Link href={`/${locale}/booking`} onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-blue-900 hover:bg-blue-800">
                      {t("navigation.bookNow")}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
