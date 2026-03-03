import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { i18n } from './i18n/config';

const intlMiddleware = createIntlMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  
  if (response) {
    response.headers.set('x-pathname', request.nextUrl.pathname);
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
