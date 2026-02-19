import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const messages = await getMessages({ locale });
  const baseUrl = 'https://amvrakikosfishing.com';
  const canonicalUrl = `${baseUrl}/${locale}`;
  
  const title = (messages as any).metadata?.title || "Amvrakikos Fishing Trips";
  const description = (messages as any).metadata?.description || "Experience unforgettable fishing adventures in Amvrakikos Bay";
  
  return {
    title,
    description,
    keywords: [
      'fishing trips',
      'Amvrakikos Bay',
      'fishing charters',
      'Greece fishing',
      'sea fishing',
      'fishing tours',
      'Preveza fishing',
      'Captain Nikos',
      'deep sea fishing',
      'sport fishing',
      'fishing vacation',
      'fishing holidays Greece',
    ].join(', '),
    authors: [{ name: 'Captain Nikos' }],
    creator: 'Amvrakikos Fishing Trips',
    publisher: 'Amvrakikos Fishing Trips',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en`,
        el: `${baseUrl}/el`,
        de: `${baseUrl}/de`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'Amvrakikos Fishing Trips',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
      creator: '@AmvrakikosFish',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming locale is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <LocalBusinessJsonLd locale={locale} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
