import { NextResponse } from 'next/server';

// Route protection is handled client-side in app/dashboard/layout.js.
// The middleware only does one thing: redirect already-authenticated users
// away from /auth/* pages (to avoid showing login to logged-in users).
// We keep this lightweight — no Supabase server call — to avoid the
// cookie-timing race that caused the infinite login-redirect loop.

export function middleware(request) {
  // Nothing to intercept for now — client-side guards handle /dashboard
  return NextResponse.next();
}

export const config = {
  matcher: [], // disabled — no routes intercepted
};
