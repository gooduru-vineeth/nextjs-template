import type { NextFetchEvent, NextRequest } from 'next/server';
import { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { isAuthenticated } from '@/libs/AuthMiddleware';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    // Block all bots except the following
    allow: [
      // See https://docs.arcjet.com/bot-protection/identifying-bots
      'CATEGORY:SEARCH_ENGINE', // Allow search engines
      'CATEGORY:PREVIEW', // Allow preview links to show OG images
      'CATEGORY:MONITOR', // Allow uptime monitoring services
    ],
  }),
);

export default async function proxy(
  request: NextRequest,
  _event: NextFetchEvent,
) {
  // Verify the request with Arcjet
  // Use `process.env` instead of Env to reduce bundle size in middleware
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.includes('/dashboard');
  const isAuthPage = pathname.includes('/sign-in') || pathname.includes('/sign-up');

  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    const authenticated = await isAuthenticated(request);
    if (authenticated) {
      const locale = pathname.match(/^\/([^/]+)\//)?.at(1) ?? '';
      const dashboardUrl = locale ? `/${locale}/dashboard` : '/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  // Protect dashboard routes
  if (isProtectedRoute) {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      const locale = pathname.match(/^\/([^/]+)\//)?.at(1) ?? '';
      const signInUrl = locale ? `/${locale}/sign-in` : '/sign-in';
      return NextResponse.redirect(new URL(signInUrl, request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
