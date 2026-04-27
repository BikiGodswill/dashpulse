import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const DEMO_COOKIE = 'dashpulse_demo';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_CONFIGURED = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Demo mode bypass ─────────────────────────────────────────────
  // If the user clicked "Try Demo", we set a first-party cookie
  // that the middleware reads here to let them through without real auth.
  const isDemoUser = request.cookies.get(DEMO_COOKIE)?.value === 'true';

  if (isDemoUser) {
    // Demo users can access dashboard but are redirected away from auth pages
    if (pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next({ request });
  }

  // ── No Supabase configured → open access ────────────────────────
  // Allows developers to explore the UI before wiring up Supabase.
  if (!SUPABASE_CONFIGURED) {
    // Just let everything through so the UI is visible
    return NextResponse.next({ request });
  }

  // ── Real Supabase auth check ─────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: use getUser() not getSession() — getSession() is unauthenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /dashboard/*
  if (pathname.startsWith('/dashboard') && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-authed users away from /auth/*
  if (pathname.startsWith('/auth') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
