import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const DEMO_COOKIE  = 'dashpulse_demo';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── 1. Demo-mode bypass ──────────────────────────────────────────
  const isDemo = request.cookies.get(DEMO_COOKIE)?.value === 'true';
  if (isDemo) {
    if (pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next({ request });
  }

  // ── 2. No Supabase env vars → open access (dev preview) ─────────
  if (!HAS_SUPABASE) {
    return NextResponse.next({ request });
  }

  // ── 3. Real Supabase session check ──────────────────────────────
  // We MUST return the supabaseResponse so Supabase can write
  // refreshed session cookies back to the browser.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet) {
        // Write cookies on both the request (for this handler) and
        // the response (so they reach the browser)
        toSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value, options);
        });
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // getUser() validates the JWT with Supabase's server — never trust getSession() alone
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && pathname.startsWith('/dashboard')) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
