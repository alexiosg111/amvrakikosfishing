export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'el', 'de'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
