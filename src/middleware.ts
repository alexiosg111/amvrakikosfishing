import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { auth } from '@/auth';
import { i18n } from './i18n/config';

const intlMiddleware = createIntlMiddleware({
  ...i18n,
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localeSegment = pathname.split('/')[1];
  const isValidLocale = (i18n.locales as readonly string[]).includes(localeSegment);
  const pathAfterLocale = isValidLocale
    ? pathname.slice(localeSegment.length + 1)
    : pathname;

  const isAdminPath = pathAfterLocale.startsWith('/admin');
  const isAdminLoginPath = pathAfterLocale.startsWith('/admin/login');

  if (isAdminPath && !isAdminLoginPath) {
    const session = await auth();
    if (!session) {
      const locale = isValidLocale ? localeSegment : 'en';
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
