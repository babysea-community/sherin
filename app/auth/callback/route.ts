import { NextResponse, type NextRequest } from 'next/server';

import { isOwnerEmail } from '@/lib/auth/owner';
import { createSupabaseServerClient } from '@/lib/database/server-actions';

const ALLOWED_NEXT_PATHS = new Set([
  '/dashboard',
  '/dashboard/studio',
  '/dashboard/gallery',
  '/dashboard/references',
  '/dashboard/usage',
  '/dashboard/profile',
]);

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = normalizeNextPath(
    requestUrl,
    requestUrl.searchParams.get('next'),
  );
  const redirectUrl = new URL(next, requestUrl.origin);
  const accessUrl = new URL('/access', requestUrl.origin);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    accessUrl.searchParams.set('error', 'callback_invalid');
    return NextResponse.redirect(accessUrl);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    accessUrl.searchParams.set('error', 'callback_invalid');
    return NextResponse.redirect(accessUrl);
  }

  if (!isOwnerEmail(data.user.email)) {
    // Not the configured owner: revoke the freshly minted session.
    await supabase.auth.signOut();
    accessUrl.searchParams.set('error', 'not_owner');
    return NextResponse.redirect(accessUrl);
  }

  return NextResponse.redirect(redirectUrl);
}

function normalizeNextPath(requestUrl: URL, value: string | null) {
  if (!value) {
    return '/dashboard/studio';
  }

  const targetUrl = new URL(value, requestUrl.origin);

  if (
    targetUrl.origin !== requestUrl.origin ||
    !ALLOWED_NEXT_PATHS.has(targetUrl.pathname)
  ) {
    return '/dashboard/studio';
  }

  return `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
}
