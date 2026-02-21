import createMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { i18n } from './i18n/config';

const publicPages = [
  "/",
  "/:locale",
  "/:locale/login",
  "/:locale/register",
  "/:locale/forgot-password",
  "/:locale/reset-password",
  "/:locale/verify-email",
  "/:locale/trips",
  "/:locale/gallery",
  "/:locale/testimonials",
  "/:locale/about",
  "/:locale/faq",
  "/:locale/contact",
  "/:locale/booking",
  "/api/auth",
];

const i18nMiddleware = createMiddleware({
  ...i18n,
  localePrefix: 'always',
});

const authMiddleware = withAuth({
  pages: {
    signIn: `/${i18n.defaultLocale}/login`,
  },
});

export default function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // Check if the path is public
  const isPublicPage = publicPages.some((page) => {
    if (page === "/api/auth") {
      return pathname.startsWith("/api/auth");
    }
    return pathname === page || pathname.startsWith(page + "/");
  });

  // Skip auth middleware for public pages and static files
  if (isPublicPage || pathname.startsWith("/_next") || pathname.includes(".")) {
    return i18nMiddleware(req);
  }

  // Apply auth middleware for protected routes
  return authMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
