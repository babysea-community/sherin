import 'server-only';

import {
  BYOK_INFERENCE_PROVIDER_IDS,
  byokProviderIdForModel,
  isByokInferenceProviderId,
  type ByokInferenceProviderId,
  type SherinModelId,
} from '@/lib/app-config';
import { getOptionalEnv } from '@/lib/utils/env';
import type { InferenceProvider, InferenceProviderId } from './types';
import {
  createBabySeaProvider,
  isBabySeaConfigured,
} from './babysea/server-actions';
import {
  createBflProvider,
  isBflConfigured,
} from './black-forest-labs/server-actions';
import {
  createRunwayProvider,
  isRunwayConfigured,
} from './runway/server-actions';

export type { InferenceProvider, InferenceProviderId } from './types';
export type { InferenceCancelResult } from './types';
export type { InferenceRequest, InferenceResult } from './types';

export type InferenceMode = 'babysea' | 'byok';

const BYOK_PROVIDER_CONFIGURED: Record<ByokInferenceProviderId, () => boolean> =
  {
    bfl: isBflConfigured,
    runway: isRunwayConfigured,
  };

const BYOK_PROVIDER_FACTORY: Record<
  ByokInferenceProviderId,
  () => InferenceProvider
> = {
  bfl: createBflProvider,
  runway: createRunwayProvider,
};

/** BYOK providers whose API key is configured on the server. */
export function getConfiguredByokProviderIds(): ByokInferenceProviderId[] {
  return BYOK_INFERENCE_PROVIDER_IDS.filter((id) =>
    BYOK_PROVIDER_CONFIGURED[id](),
  );
}

function isAnyByokConfigured() {
  return getConfiguredByokProviderIds().length > 0;
}

function normalizeMode(value: string | undefined): InferenceMode | null {
  if (!value) {
    return null;
  }

  const lower = value.trim().toLowerCase();

  if (lower === 'babysea') {
    return 'babysea';
  }

  if (lower === 'byok' || isByokInferenceProviderId(lower)) {
    return 'byok';
  }

  return null;
}

/**
 * Resolve the active inference mode. BYOK takes precedence unless
 * INFERENCE_PROVIDER=babysea, because BYOK is the app's default stack. In BYOK
 * mode every configured provider (BFL, Runway) is active and each model routes
 * to its provider by id prefix. Returns null when nothing is configured.
 */
export function resolveInferenceMode(): InferenceMode | null {
  const configured = getOptionalEnv('INFERENCE_PROVIDER');
  const preferred = normalizeMode(configured);

  if (configured && !preferred) {
    throw new Error(
      'INFERENCE_PROVIDER must be byok, babysea, bfl, or runway.',
    );
  }

  if (preferred === 'babysea') {
    if (!isBabySeaConfigured()) {
      throw new Error(
        'INFERENCE_PROVIDER=babysea but BABYSEA_API_KEY is not set.',
      );
    }

    return 'babysea';
  }

  if (preferred === 'byok') {
    if (!isAnyByokConfigured()) {
      throw new Error(
        'INFERENCE_PROVIDER=byok but no BYOK provider key (BFL_API_KEY, RUNWAYML_API_SECRET) is set.',
      );
    }

    return 'byok';
  }

  if (isAnyByokConfigured()) {
    return 'byok';
  }

  if (isBabySeaConfigured()) {
    return 'babysea';
  }

  return null;
}

/** Resolve the provider that runs a given model under the active mode. */
export function resolveInferenceProviderForModel(
  model: SherinModelId,
): InferenceProvider {
  const mode = resolveInferenceMode();

  if (mode === null) {
    throw new Error(
      'No inference provider configured. Set a BYOK provider key or BABYSEA_API_KEY.',
    );
  }

  if (mode === 'babysea') {
    return createBabySeaProvider();
  }

  const byokId = byokProviderIdForModel(model);

  if (!byokId) {
    throw new Error(`No BYOK provider owns model ${model}.`);
  }

  if (!BYOK_PROVIDER_CONFIGURED[byokId]()) {
    throw new Error(
      `Model ${model} requires ${byokId}, but its API key is not configured.`,
    );
  }

  return BYOK_PROVIDER_FACTORY[byokId]();
}

/**
 * Representative active provider at the mode level (BabySea, or the first
 * configured BYOK provider). Used for status/defaults; per-model generation
 * uses `resolveInferenceProviderForModel`.
 */
export function resolveInferenceProvider(): InferenceProvider {
  const mode = resolveInferenceMode();

  if (mode === null) {
    throw new Error(
      'No inference provider configured. Set a BYOK provider key or BABYSEA_API_KEY.',
    );
  }

  if (mode === 'babysea') {
    return createBabySeaProvider();
  }

  const [firstByok] = getConfiguredByokProviderIds();

  if (!firstByok) {
    throw new Error('BYOK mode selected but no BYOK provider is configured.');
  }

  return BYOK_PROVIDER_FACTORY[firstByok]();
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

  if (isByokInferenceProviderId(providerId)) {
    if (!BYOK_PROVIDER_CONFIGURED[providerId]()) {
      throw new Error(
        `Queued generation requires ${providerId}, but its API key is not set.`,
      );
    }

    return BYOK_PROVIDER_FACTORY[providerId]();
  }

  throw new Error(`Unsupported queued inference provider: ${providerId}`);
}

export function getInferenceProviderStatus() {
  const configuredByok = getConfiguredByokProviderIds();
  const babysea = isBabySeaConfigured();
  const mode = (() => {
    try {
      return resolveInferenceMode();
    } catch {
      return null;
    }
  })();

  return {
    mode,
    configuredByok,
    byok: configuredByok.length > 0,
    babysea,
    active: mode,
  };
}
