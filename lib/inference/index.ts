import 'server-only';

import { getOptionalEnv } from '@/lib/utils/env';
import type { InferenceProvider, InferenceProviderId } from './types';
import { createBflProvider, isBflConfigured } from './bfl/server-actions';
import {
  createBabySeaProvider,
  isBabySeaConfigured,
} from './babysea/server-actions';

export type { InferenceProvider, InferenceProviderId } from './types';
export type { InferenceRequest, InferenceResult } from './types';

/**
 * Resolve the active inference provider. Sherin auto-detects which provider
 * is configured. If both are present, INFERENCE_PROVIDER decides; otherwise
 * BFL takes precedence because it is Sherin's default stack.
 */
export function resolveInferenceProvider(): InferenceProvider {
  const configuredPreference = getOptionalEnv('INFERENCE_PROVIDER');
  const preferred = normalizePreference(configuredPreference);
  const babyseaReady = isBabySeaConfigured();
  const bflReady = isBflConfigured();

  if (configuredPreference && !preferred) {
    throw new Error('INFERENCE_PROVIDER must be bfl or babysea.');
  }

  if (preferred === 'babysea') {
    if (!babyseaReady) {
      throw new Error(
        'INFERENCE_PROVIDER=babysea but BABYSEA_API_KEY is not set.',
      );
    }
    return createBabySeaProvider();
  }

  if (preferred === 'bfl') {
    if (!bflReady) {
      throw new Error('INFERENCE_PROVIDER=bfl but BFL_API_KEY is not set.');
    }
    return createBflProvider();
  }

  if (bflReady) {
    return createBflProvider();
  }

  if (babyseaReady) {
    return createBabySeaProvider();
  }

  throw new Error(
    'No inference provider configured. Set BABYSEA_API_KEY or BFL_API_KEY.',
  );
}

export function resolveInferenceProviderById(
  providerId: InferenceProviderId,
): InferenceProvider {
  if (providerId === 'babysea') {
    if (!isBabySeaConfigured()) {
      throw new Error(
        'Queued generation requires BabySea, but BABYSEA_API_KEY is not set.',
      );
    }

    return createBabySeaProvider();
  }

  if (providerId === 'bfl') {
    if (!isBflConfigured()) {
      throw new Error(
        'Queued generation requires BFL, but BFL_API_KEY is not set.',
      );
    }

    return createBflProvider();
  }

  throw new Error(`Unsupported queued inference provider: ${providerId}`);
}

export function getInferenceProviderStatus() {
  const preferred = normalizePreference(getOptionalEnv('INFERENCE_PROVIDER'));
  const bfl = isBflConfigured();
  const babysea = isBabySeaConfigured();
  const active: InferenceProviderId | null = (() => {
    try {
      return resolveInferenceProvider().id;
    } catch {
      return null;
    }
  })();

  return { preferred, bfl, babysea, active };
}

function normalizePreference(
  value: string | undefined,
): InferenceProviderId | null {
  if (!value) {
    return null;
  }
  const lower = value.trim().toLowerCase();
  if (lower === 'bfl' || lower === 'babysea') {
    return lower;
  }
  return null;
}
