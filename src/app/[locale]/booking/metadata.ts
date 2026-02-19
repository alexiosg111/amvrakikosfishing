import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateBookingMetadata({
  locale,
}: {
  locale: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'booking' });
  const baseUrl = 'https://amvrakikosfishing.com';
  const canonicalUrl = `${baseUrl}/${locale}/booking`;
  const title = `${t("title")} | Amvrakikos Fishing Trips`;
  
  return {
    title,
    description: t("title"),
    keywords: 'book fishing trip, fishing reservation, Amvrakikos Bay booking, fishing charter booking',
    openGraph: {
      title,
      description: t("title"),
      url: canonicalUrl,
      type: 'website',
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
      description: t("title"),
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
