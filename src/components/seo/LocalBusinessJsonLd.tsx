import { getTranslations } from 'next-intl/server';

interface LocalBusinessJsonLdProps {
  locale: string;
}

export async function LocalBusinessJsonLd({ locale }: LocalBusinessJsonLdProps) {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  const baseUrl = 'https://amvrakikosfishing.com';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Amvrakikos Fishing Trips',
    description: t('description'),
    image: `${baseUrl}/og-image.jpg`,
    url: baseUrl,
    telephone: '+30 26820 00000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Port of Preveza',
      addressLocality: 'Preveza',
      addressRegion: 'Epirus',
      postalCode: '481 00',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.9565,
      longitude: 20.7533,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '06:00',
      closes: '20:00',
    },
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
    sameAs: [
      'https://www.facebook.com/amvrakikosfishing',
      'https://www.instagram.com/amvrakikosfishing',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
