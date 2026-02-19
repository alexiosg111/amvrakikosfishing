import { Trip } from '@/types';

interface TripProductJsonLdProps {
  trip: Trip;
  locale: string;
}

export function TripProductJsonLd({ trip, locale }: TripProductJsonLdProps) {
  const baseUrl = 'https://amvrakikosfishing.com';
  const tripUrl = `${baseUrl}/${locale}/trips/${trip.id}`;
  const imageUrl = trip.images[0] || `${baseUrl}/og-image.jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: trip.name,
    description: trip.description,
    image: imageUrl,
    url: tripUrl,
    offers: {
      '@type': 'Offer',
      price: trip.basePrice,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: tripUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '50',
    },
    brand: {
      '@type': 'Brand',
      name: 'Amvrakikos Fishing Trips',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
