import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Locale, i18n } from './config';

export default getRequestConfig(async ({ locale }) => {
  if (!i18n.locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale: locale as string,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
