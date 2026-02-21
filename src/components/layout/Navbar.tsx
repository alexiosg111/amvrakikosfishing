"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { Menu, X, Anchor, User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Extract locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en';

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  const navItems = [
    { href: `/${locale}`, label: t("navigation.home") },
    { href: `/${locale}/trips`, label: t("navigation.trips") },
    { href: `/${locale}/gallery`, label: t("navigation.gallery") },
    { href: `/${locale}/testimonials`, label: t("navigation.testimonials") },
    { href: `/${locale}/about`, label: t("navigation.about") },
    { href: `/${locale}/faq`, label: t("navigation.faq") },
    { href: `/${locale}/contact`, label: t("navigation.contact") },
  ];

  // Add dashboard link for authenticated users
  if (session?.user) {
    if (session.user.role === "ADMIN") {
      navItems.push({ href: `/${locale}/admin`, label: t("navigation.admin") });
    }
  }

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

            {status === "authenticated" && session?.user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name || session.user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/dashboard`} className="cursor-pointer flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {session.user.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/admin`} className="cursor-pointer flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center gap-2 text-red-600">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href={`/${locale}/login`} className="hidden sm:block">
                  <Button variant="ghost">
                    {t("auth.login.title")}
                  </Button>
                </Link>
                <Link href={`/${locale}/booking`} className="hidden sm:block">
                  <Button className="bg-blue-900 hover:bg-blue-800">
                    {t("navigation.bookNow")}
                  </Button>
                </Link>
              </>
            )}

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
                  {status === "authenticated" ? (
                    <>
                      <Link href={`/${locale}/dashboard`} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      {session?.user?.role === "ADMIN" && (
                        <Link href={`/${locale}/admin`} onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full justify-start">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Admin
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href={`/${locale}/login`} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          {t("auth.login.title")}
                        </Button>
                      </Link>
                      <Link href={`/${locale}/booking`} onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-blue-900 hover:bg-blue-800">
                          {t("navigation.bookNow")}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
