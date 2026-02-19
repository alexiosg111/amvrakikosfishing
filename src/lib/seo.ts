import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amvrakikosfishing.com';
export const SITE_NAME = 'Amvrakikos Fishing Trips';

export interface SEOConfig {
  title: string;
  description: string;
  path: string;
  images?: string[];
  locale: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function generateSeoMetadata(config: SEOConfig): Metadata {
  const canonicalUrl = `${SITE_URL}/${config.locale}${config.path}`;
  const defaultImage = `${SITE_URL}/og-image.jpg`;
  const images = config.images?.map(img => ({
    url: img.startsWith('http') ? img : `${SITE_URL}${img}`,
    width: 1200,
    height: 630,
    alt: config.title,
  })) || [{
    url: defaultImage,
    width: 1200,
    height: 630,
    alt: config.title,
  }];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: routing.locales.reduce((acc, locale) => {
        acc[locale] = `${SITE_URL}/${locale}${config.path}`;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: config.locale,
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: images.map(img => img.url),
      creator: '@AmvrakikosFish',
    },
    robots: {
      index: !config.noIndex,
      follow: !config.noIndex,
      googleBot: {
        index: !config.noIndex,
        follow: !config.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function getHreflangTags(currentLocale: string, path: string) {
  const baseUrl = SITE_URL;
  const tags: Array<{ rel: 'alternate'; hrefLang: string; href: string }> = [];
  
  // Add each language version
  routing.locales.forEach(locale => {
    tags.push({
      rel: 'alternate' as const,
      hrefLang: locale,
      href: `${baseUrl}/${locale}${path}`,
    });
  });
  
  // Add x-default for international targeting
  tags.push({
    rel: 'alternate' as const,
    hrefLang: 'x-default',
    href: `${baseUrl}/en${path}`,
  });
  
  return tags;
}

export function getJsonLd(type: 'LocalBusiness' | 'Product' | 'FAQPage' | 'BreadcrumbList', data: any) {
  const baseJsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
  
  return JSON.stringify(baseJsonLd);
}
