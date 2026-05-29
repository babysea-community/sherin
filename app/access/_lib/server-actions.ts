'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { getSiteUrl } from '@/lib/utils/env';
import { createSupabaseServerClient } from '@/lib/database/server-actions';

export async function signInWithGoogle() {
  const supabase = await createSupabaseServerClient();
  const redirectTo = new URL('/auth/callback', await getRequestOrigin());
  redirectTo.searchParams.set('next', '/dashboard/studio');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo.toString(),
      queryParams: {
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    redirect('/access?error=oauth_failed');
  }

  if (!data.url) {
    redirect('/access?error=oauth_unavailable');
  }

  redirect(data.url);
}

async function getRequestOrigin() {
  const requestHeaders = await headers();
  const origin = normalizeOrigin(requestHeaders.get('origin'));

  if (origin) {
    return origin;
  }

  const forwardedHost = firstHeaderValue(
    requestHeaders.get('x-forwarded-host'),
  );
  const host = forwardedHost ?? firstHeaderValue(requestHeaders.get('host'));

  if (!host) {
    return getSiteUrl();
  }

  const forwardedProto = firstHeaderValue(
    requestHeaders.get('x-forwarded-proto'),
  );
  const protocol = forwardedProto ?? (isLocalhostHost(host) ? 'http' : 'https');
  const requestOrigin = normalizeOrigin(`${protocol}://${host}`);

  return requestOrigin ?? getSiteUrl();
}

function firstHeaderValue(value: string | null) {
  return value?.split(',')[0]?.trim() || undefined;
}

function normalizeOrigin(value: string | null | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return undefined;
    }

    if (url.protocol !== 'https:' && !isLocalhostHost(url.host)) {
      return undefined;
    }

    return url.origin;
  } catch {
    return undefined;
  }
}

function isLocalhostHost(host: string) {
  const normalizedHost = host.toLowerCase();

  if (normalizedHost.startsWith('[')) {
    return normalizedHost.startsWith('[::1]');
  }

  const hostname = normalizedHost.split(':')[0];

  return hostname === 'localhost' || hostname === '127.0.0.1';
}
