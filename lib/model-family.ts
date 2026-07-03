/**
 * App model-family registry facade (multi-BYOK).
 *
 * `sherin` supports multiple BYOK provider families (Alibaba Cloud + BFL +
 * Runway) plus BabySea. Each model id is prefixed with its provider and routed
 * to the matching direct adapter. The catalog surfaced to the studio is gated by
 * which provider keys are configured (see `lib/inference`). BabySea mode exposes
 * the combined catalog routed through the BabySea API.
 */
import {
  SHERIN_BYOK_FAMILY as ALIBABACLOUD_FAMILY,
  hasAlibabaCloudModelConfig,
  type AlibabaCloudModelId,
} from './inference/alibaba-cloud/family';
import {
  SHERIN_BYOK_FAMILY as BFL_FAMILY,
  hasBflModelConfig,
  type BflModelId,
} from './inference/black-forest-labs/family';
import {
  SHERIN_BYOK_FAMILY as RUNWAY_FAMILY,
  hasRunwayModelConfig,
  type RunwayModelId,
} from './inference/runway/family';

export { SHERIN_BYOK_FAMILY as BYOK_FAMILY } from './inference/black-forest-labs/family';

export type SherinModelId = AlibabaCloudModelId | BflModelId | RunwayModelId;
export type SherinModelOption = { id: SherinModelId; label: string };

export const MODEL_OPTIONS: readonly SherinModelOption[] = [
  ...ALIBABACLOUD_FAMILY.modelOptions,
  ...BFL_FAMILY.modelOptions,
  ...RUNWAY_FAMILY.modelOptions,
];

export const MODEL_IDS = MODEL_OPTIONS.map((option) => option.id) as [
  SherinModelId,
  ...SherinModelId[],
];

export const DEFAULT_MODEL_ID: SherinModelId = BFL_FAMILY.defaultModelId;

/** BYOK provider ids, in alphabetical catalog order. */
export const BYOK_INFERENCE_PROVIDER_IDS = [
  ALIBABACLOUD_FAMILY.providerId,
  BFL_FAMILY.providerId,
  RUNWAY_FAMILY.providerId,
] as const;
export type ByokInferenceProviderId =
  (typeof BYOK_INFERENCE_PROVIDER_IDS)[number];

export function isByokInferenceProviderId(
  value: unknown,
): value is ByokInferenceProviderId {
  return (
    typeof value === 'string' &&
    (BYOK_INFERENCE_PROVIDER_IDS as readonly string[]).includes(value)
  );
}

const BYOK_PROVIDER_LABELS = {
  [ALIBABACLOUD_FAMILY.providerId]: ALIBABACLOUD_FAMILY.providerLabel,
  [BFL_FAMILY.providerId]: BFL_FAMILY.providerLabel,
  [RUNWAY_FAMILY.providerId]: RUNWAY_FAMILY.providerLabel,
} as Record<ByokInferenceProviderId, string>;

const BYOK_PROVIDER_KEYWORDS = {
  [ALIBABACLOUD_FAMILY.providerId]: ALIBABACLOUD_FAMILY.providerKeyword,
  [BFL_FAMILY.providerId]: BFL_FAMILY.providerKeyword,
  [RUNWAY_FAMILY.providerId]: RUNWAY_FAMILY.providerKeyword,
} as Record<ByokInferenceProviderId, string>;

const BYOK_MODEL_ID_PREFIXES = {
  [ALIBABACLOUD_FAMILY.providerId]: ALIBABACLOUD_FAMILY.modelIdPrefix,
  [BFL_FAMILY.providerId]: BFL_FAMILY.modelIdPrefix,
  [RUNWAY_FAMILY.providerId]: RUNWAY_FAMILY.modelIdPrefix,
} as Record<ByokInferenceProviderId, string>;

export function byokProviderLabel(providerId: ByokInferenceProviderId) {
  return BYOK_PROVIDER_LABELS[providerId];
}

export function byokProviderKeyword(providerId: ByokInferenceProviderId) {
  return BYOK_PROVIDER_KEYWORDS[providerId];
}

export function byokModelIdPrefix(providerId: ByokInferenceProviderId) {
  return BYOK_MODEL_ID_PREFIXES[providerId];
}

/** Resolve which BYOK provider owns a model id (by config membership). */
export function byokProviderIdForModel(
  model: string,
): ByokInferenceProviderId | null {
  if (hasAlibabaCloudModelConfig(model)) {
    return ALIBABACLOUD_FAMILY.providerId;
  }

  if (hasBflModelConfig(model)) {
    return BFL_FAMILY.providerId;
  }

  if (hasRunwayModelConfig(model)) {
    return RUNWAY_FAMILY.providerId;
  }

  return null;
}

export function isSherinModelId(value: unknown): value is SherinModelId {
  return (
    typeof value === 'string' && MODEL_IDS.includes(value as SherinModelId)
  );
}

export const RATIOS = {} as Record<string, { width: number; height: number }>;
export type SherinDimensionRatio = string;
export const RATIO_OPTIONS = uniqueStrings([
  ...ALIBABACLOUD_FAMILY.ratioOptions,
  ...BFL_FAMILY.ratioOptions,
  ...RUNWAY_FAMILY.ratioOptions,
]);
export type SherinRatio = (typeof RATIO_OPTIONS)[number];

export const OUTPUT_FORMATS = uniqueStrings([
  ...ALIBABACLOUD_FAMILY.outputFormats,
  ...BFL_FAMILY.outputFormats,
  ...RUNWAY_FAMILY.outputFormats,
]);
export type SherinOutputFormat = (typeof OUTPUT_FORMATS)[number];

export const DEFAULT_RATIO: SherinDimensionRatio = BFL_FAMILY.defaultRatio;
export const DEFAULT_OUTPUT_FORMAT: SherinOutputFormat =
  BFL_FAMILY.defaultOutputFormat;
export const RESOLUTION_OPTIONS = uniqueStrings([
  ...ALIBABACLOUD_FAMILY.resolutionOptions,
  ...BFL_FAMILY.resolutionOptions,
  ...RUNWAY_FAMILY.resolutionOptions,
]);
export type SherinResolution = (typeof RESOLUTION_OPTIONS)[number];
export const DEFAULT_RESOLUTION: SherinResolution | undefined =
  BFL_FAMILY.defaultResolution as SherinResolution | undefined;
export const GENERATION_PROMPT_PLACEHOLDER =
  'A cinematic editorial portrait with arctic light, soft film grain...';

export const DEFAULT_GENERATION_OUTPUT_NUMBER = 1;
export const DEFAULT_GENERATION_OUTPUT_QUALITY = 80;
export const DEFAULT_GENERATION_GUIDANCE_SCALE = 3.5;
export const DEFAULT_GENERATION_NUM_INFERENCE_STEPS = 28;
export const DEFAULT_BYOK_GUIDANCE = BFL_FAMILY.defaultGenerationGuidance;
export const DEFAULT_BYOK_STEPS = BFL_FAMILY.defaultGenerationSteps;
export const DEFAULT_BYOK_SAFETY_TOLERANCE = BFL_FAMILY.defaultSafetyTolerance;

export const BYOK_MODEL_CONFIGS = {
  ...ALIBABACLOUD_FAMILY.modelConfigs,
  ...BFL_FAMILY.modelConfigs,
  ...RUNWAY_FAMILY.modelConfigs,
};
export const BYOK_MODEL_IDS = MODEL_IDS;

export const BABYSEA_MODEL_CONFIGS = {
  ...ALIBABACLOUD_FAMILY.babySeaModelConfigs,
  ...BFL_FAMILY.babySeaModelConfigs,
  ...RUNWAY_FAMILY.babySeaModelConfigs,
};

export type BabySeaModelConfig =
  (typeof BABYSEA_MODEL_CONFIGS)[keyof typeof BABYSEA_MODEL_CONFIGS];

export const SHERIN_INPUT_FILE_LIMIT = Math.max(
  ...Object.values(BYOK_MODEL_CONFIGS).map((model) =>
    Math.max(model.inputImageLimit, model.inputVideoLimit),
  ),
  ...Object.values(BABYSEA_MODEL_CONFIGS).map((model) => model.inputMediaLimit),
);

export type InferenceProviderScope = 'babysea' | ByokInferenceProviderId | null;

export function hasByokModelConfig(model: string): model is SherinModelId {
  return (
    hasAlibabaCloudModelConfig(model) ||
    hasBflModelConfig(model) ||
    hasRunwayModelConfig(model)
  );
}

export function getModelOptionsForInferenceProvider(
  providerId: InferenceProviderScope,
) {
  if (providerId !== null && isByokInferenceProviderId(providerId)) {
    return MODEL_OPTIONS.filter(
      (option) => byokProviderIdForModel(option.id) === providerId,
    );
  }

  return MODEL_OPTIONS;
}

/** Combined catalog for the given set of configured BYOK providers. */
export function getModelOptionsForByokProviders(
  providerIds: readonly ByokInferenceProviderId[],
) {
  const configured = new Set<ByokInferenceProviderId>(providerIds);

  return MODEL_OPTIONS.filter((option) => {
    const owner = byokProviderIdForModel(option.id);

    return owner !== null && configured.has(owner);
  });
}

export function getModelIdsForInferenceProvider(
  providerId: InferenceProviderScope,
) {
  return getModelOptionsForInferenceProvider(providerId).map(
    (option) => option.id,
  );
}

export function getDefaultModelIdForInferenceProvider(
  providerId: InferenceProviderScope,
) {
  if (providerId !== null && isByokInferenceProviderId(providerId)) {
    const owned = getModelIdsForInferenceProvider(providerId);

    if (!owned.includes(DEFAULT_MODEL_ID)) {
      return owned[0] ?? DEFAULT_MODEL_ID;
    }
  }

  return DEFAULT_MODEL_ID;
}

export function getBabySeaInputFileLimit(model: SherinModelId) {
  const config = BABYSEA_MODEL_CONFIGS[model];

  if (!config) {
    throw new Error(`BabySea does not support model ${model}.`);
  }

  return config.inputMediaLimit;
}

export function getBabySeaProviderOrderOverride(modelIdentifier: string) {
  return Object.values(BABYSEA_MODEL_CONFIGS).find(
    (model) => model.identifier === modelIdentifier,
  )?.providerOrderOptions;
}

export function isSherinResolution(
  value: string | undefined,
): value is SherinResolution {
  return RESOLUTION_OPTIONS.includes(value as SherinResolution);
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values)];
}
