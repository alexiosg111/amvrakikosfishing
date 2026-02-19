import { MetadataRoute } from 'next';
import { getTrips } from '@/actions/trips';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://amvrakikosfishing.com';
  const locales = routing.locales;
  
  // Get all trips
  const trips = await getTrips();
  
  // Static routes for all locales
  const staticRoutes = ['/', '/trips', '/booking'].map((route) => 
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '/' ? 1 : 0.8,
    }))
  ).flat();

  // Dynamic trip routes for all locales
  const tripRoutes = trips.flatMap((trip) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/trips/${trip.id}`,
      lastModified: trip.updatedAt ? new Date(trip.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...staticRoutes,
    ...tripRoutes,
  ];
}
