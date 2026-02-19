/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Create a localized URL path
 */
export function getLocalizedPath(path: string, locale: string): string {
  return `/${locale}${path}`;
}

/**
 * Get the current locale from a path
 */
export function getLocaleFromPath(path: string): string {
  const match = path.match(/^\/([a-z]{2})(\/|$)/);
  return match ? match[1] : 'en';
}

/**
 * Truncate text to a specific length for SEO
 */
export function truncateForSeo(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}
