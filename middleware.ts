import { authMiddleware } from '@clerk/nextjs';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define locales and default
const locales = ['es', 'en', 'pt', 'fr', 'it', 'de', 'nl', 'sv', 'no', 'da', 'ja', 'ko', 'zh'];
const defaultLocale = 'es';

// Create next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Define protected routes (requires authentication)
const isProtectedRoute = (path: string) => {
  return /^\/studio|\/admin|\/upload|\/success/.test(path);
};

/** Security headers constants */
const STRIPE_JS = 'https://js.stripe.com';
const CF_CHAL = 'https://challenges.cloudflare.com';
const API_STRIPE = 'https://api.stripe.com';

/** Content Security Policy */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' " + STRIPE_JS + " " + CF_CHAL,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' " + API_STRIPE + " " + CF_CHAL,
  "frame-src " + STRIPE_JS + " " + CF_CHAL,
  "worker-src 'self' blob:",
  "media-src 'self' blob:",
  "object-src 'none'"
].join('; ');

function applySecurityHeaders(res: NextResponse) {
  res.headers.set('Content-Security-Policy', CSP);
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', [
    'accelerometer=()', 'ambient-light-sensor=()', 'autoplay=()',
    'camera=()', 'clipboard-read=()', 'clipboard-write=()',
    'gyroscope=()', 'microphone=()', 'geolocation=()',
    `payment=(self ${STRIPE_JS})`, 'fullscreen=(self)'
  ].join(', '));
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp; report-to="coop"');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  return res;
}

/** Routes that require human verification (Turnstile cookie) */
const NEED_HUMAN = [/^\/contact/, /^\/checkout/];

// Combine Clerk and next-intl middleware with security headers
export default authMiddleware({
  publicRoutes: ['/api/turnstile/verify', '/api/stripe/webhook', '/api/health'],
  beforeAuth: async (request: NextRequest) => {
    const url = request.nextUrl.clone();
    const path = url.pathname;
    const res = NextResponse.next();
    applySecurityHeaders(res);

    // CSRF cookie (double-submit)
    let csrf = request.cookies.get('sn_csrf')?.value;
    if (!csrf) {
      const bytes = new Uint8Array(16);
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(bytes);
        csrf = Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
        res.cookies.set('sn_csrf', csrf, { path:'/', maxAge: 60*60*24*30, sameSite:'lax', secure: true });
      }
    }

    // A/B cookie para /pricing
    if (path.startsWith('/pricing')) {
      const ab = request.cookies.get('ab_pricing')?.value;
      if (!ab) {
        const v = Math.random() < 0.5 ? 'A' : 'B';
        res.cookies.set('ab_pricing', v, { path: '/', maxAge: 60*60*24*90, sameSite: 'lax' });
      }
    }

    // Check for human verification on sensitive routes
    const needHuman = NEED_HUMAN.some((re) => re.test(path));
    if (needHuman) {
      const cookie = request.cookies.get('human_ok')?.value;
      if (cookie !== '1') {
        url.pathname = "/security/human-check";
        const redirect = NextResponse.redirect(url);
        applySecurityHeaders(redirect);
        return redirect;
      }
    }

    // CSRF enforcement
    const isApi = path.startsWith('/api/');
    const write = ['POST','PUT','PATCH','DELETE'].includes(request.method);
    const WL = ['/api/stripe/webhook','/api/turnstile/verify'];
    const inWL = WL.some(w=> path.startsWith(w));
    if (isApi && write && !inWL) {
      const hdr = request.headers.get('x-csrf-token') || '';
      const ck  = request.cookies.get('sn_csrf')?.value || '';
      if (!ck || hdr !== ck) {
        return new NextResponse('Forbidden (CSRF)', { status: 403 });
      }
    }

    return res;
  },
  afterAuth: async (auth, request: NextRequest) => {
    // Check if route is protected
    if (isProtectedRoute(request.nextUrl.pathname)) {
      const { userId } = auth;
      if (!userId) {
        // Redirect to sign-in if not authenticated
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('redirect_url', request.url);
        return Response.redirect(signInUrl);
      }
    }

    // Apply next-intl middleware for locale handling
    const response = intlMiddleware(request);
    applySecurityHeaders(response);
    return response;
  }
});

export const config = {
  matcher: [
    // Skip all internal Next.js paths
    '/((?!_next|_vercel|.*\\..*|api|favicon.ico|robots.txt|sitemap.xml).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

// TODO: Rate limiting for generation endpoints should be implemented here
// or in API route handlers using @/lib/ratelimit
// Example: Check rate limits for /api/studio and /api/upload routes
