# SEO Implementation Guide - Amvrakikos Fishing Trips

## Overview
This document describes the SEO (Search Engine Optimization) and internationalization implementation for the Amvrakikos Fishing Trips website.

## Features Implemented

### 1. Internationalization (i18n)
- **Languages Supported**: English (en), Greek (el), German (de)
- **Library**: next-intl
- **Locale Routing**: `/en`, `/el`, `/de`
- **Default Locale**: English
- **Location**: Translation files in `/messages/` directory

### 2. SEO Enhancements

#### Metadata Generation
All pages include comprehensive metadata:
- Title tags
- Meta descriptions
- Keywords
- Canonical URLs
- hreflang tags for multilingual SEO

#### OpenGraph & Social Media
- OpenGraph tags for Facebook/LinkedIn sharing
- Twitter Card tags for Twitter sharing
- Optimized images (1200x630px recommended)

#### Structured Data (JSON-LD)
- **LocalBusiness**: For the fishing company details
- **Product**: For individual fishing trips
- **FAQPage**: For the FAQ page
- **BreadcrumbList**: For navigation structure

#### Sitemap & Robots
- **Sitemap**: Automatically generated at `/sitemap.xml`
  - Includes all static routes
  - Includes all dynamic trip pages
  - Multilingual support with separate URLs per language
- **Robots.txt**: Generated at `/robots.txt`
  - Allows crawling of public pages
  - Disallows API routes and admin areas

#### PWA Support
- Web App Manifest: `/manifest.json`
- Mobile-friendly icons (192x192, 512x512)
- App name and short name
- Theme colors

## File Structure

```
/home/engine/project/
├── src/
│   ├── app/
│   │   ├── sitemap.ts              # Dynamic sitemap generation
│   │   ├── robots.ts               # Robots.txt generation
│   │   └── [locale]/
│   │       ├── layout.tsx          # Main layout with SEO metadata
│   │       ├── page.tsx            # Home page with metadata
│   │       ├── trips/
│   │       │   ├── page.tsx        # Trips listing with metadata
│   │       │   └── [id]/page.tsx   # Trip detail with metadata
│   │       └── booking/
│   │           ├── page.tsx        # Booking page
│   │           └── metadata.ts     # Booking page metadata
│   ├── components/
│   │   └── seo/
│   │       ├── LocalBusinessJsonLd.tsx
│   │       ├── TripProductJsonLd.tsx
│   │       ├── FAQJsonLd.tsx
│   │       └── BreadcrumbJsonLd.tsx
│   ├── i18n/
│   │   ├── config.ts               # i18n configuration
│   │   ├── routing.ts              # Routing configuration
│   │   └── request.ts              # Request configuration
│   └── lib/
│       └── seo.ts                  # SEO utility functions
├── messages/
│   ├── en.json                     # English translations
│   ├── el.json                     # Greek translations
│   └── de.json                     # German translations
├── public/
│   ├── manifest.json               # PWA manifest
│   └── og-image.jpg               # OpenGraph image (to be added)
├── sitemap.config.ts               # next-sitemap configuration
└── package.json
```

## Usage

### Adding SEO to a New Page

```typescript
import { generateSeoMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'yourNamespace' });
  
  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    path: '/your-path',
    locale,
    keywords: ['keyword1', 'keyword2'],
  });
}
```

### Adding Structured Data

```typescript
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd';

export default function YourPage({ params: { locale } }) {
  return (
    <>
      <LocalBusinessJsonLd locale={locale} />
      {/* Your page content */}
    </>
  );
}
```

### Adding Breadcrumbs

```typescript
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

const breadcrumbItems = [
  { name: 'Home', href: '/' },
  { name: 'Trips', href: '/trips' },
  { name: 'Trip Name', href: '/trips/1' },
];

<BreadcrumbJsonLd items={breadcrumbItems} locale={locale} />
```

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://amvrakikosfishing.com
```

### Google Search Console

Update the Google verification code in `src/app/[locale]/layout.tsx`:

```typescript
verification: {
  google: 'your-actual-verification-code',
},
```

## Images

### Required Images

1. **OpenGraph Image** (`public/og-image.jpg`)
   - Size: 1200x630 pixels
   - Format: JPG
   - Content: Fishing trip imagery, boat, or scenic view

2. **Favicon** (`public/favicon.ico`)
   - Standard favicon format

3. **App Icons**
   - `public/icon-192.png` (192x192)
   - `public/icon-512.png` (512x512)

## Building

The sitemap is automatically generated during the build process:

```bash
npm run build
```

This will:
1. Build the Next.js application
2. Generate `public/sitemap.xml`
3. Generate `public/robots.txt`

## Testing SEO

### Check Structured Data
Use Google's Rich Results Test: https://search.google.com/test/rich-results

### Check Sitemap
Visit: `https://your-domain.com/sitemap.xml`

### Check Robots.txt
Visit: `https://your-domain.com/robots.txt`

### Check OpenGraph
Use Facebook's Sharing Debugger: https://developers.facebook.com/tools/debug/

## Best Practices

1. **Unique Titles**: Each page should have a unique, descriptive title
2. **Meta Descriptions**: Keep between 150-160 characters
3. **Keywords**: Use relevant keywords naturally, don't stuff
4. **Images**: Always include alt text
5. **Canonical URLs**: Ensure each page has a canonical URL
6. **Hreflang**: Implement hreflang tags for multilingual sites
7. **Sitemap**: Keep sitemap updated with all important pages
8. **Robots.txt**: Don't block important pages from being indexed

## Maintenance

### Regular Tasks
- Update sitemap when adding new trips
- Review and update metadata periodically
- Check for broken links
- Monitor search console for issues
- Update translations when content changes

### Performance
- Keep image files optimized
- Minimize JavaScript bundle size
- Use lazy loading for images
- Enable compression

## Additional Resources

- [Next.js SEO Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org](https://schema.org/)
- [OpenGraph Protocol](https://ogp.me/)
