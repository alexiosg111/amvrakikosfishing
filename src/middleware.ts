import createMiddleware from 'next-intl/middleware';
import { i18n } from './i18n/config';

export default createMiddleware({
  ...i18n,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
};
