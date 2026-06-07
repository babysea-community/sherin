/**
 * Sherin model-family registry.
 *
 * When cloning Sherin into a model-specific starter, keep the model catalog,
 * provider capabilities, and provider-specific overrides in this file first.
 */
export const MODEL_OPTIONS = [
  { id: 'bfl/flux-1.1-pro', label: 'FLUX 1.1 Pro' },
  { id: 'bfl/flux-1.1-pro-ultra', label: 'FLUX 1.1 Pro Ultra' },
  { id: 'bfl/flux-2-flex', label: 'FLUX 2 Flex' },
  { id: 'bfl/flux-2-klein-4b', label: 'FLUX 2 Klein 4B' },
  { id: 'bfl/flux-2-klein-9b', label: 'FLUX 2 Klein 9B' },
  { id: 'bfl/flux-2-max', label: 'FLUX 2 Max' },
  { id: 'bfl/flux-2-pro', label: 'FLUX 2 Pro' },
] as const;

export type SherinModelId = (typeof MODEL_OPTIONS)[number]['id'];

export const MODEL_IDS = MODEL_OPTIONS.map((model) => model.id) as [
  SherinModelId,
  ...SherinModelId[],
];

export const DEFAULT_MODEL_ID: SherinModelId = 'bfl/flux-1.1-pro';
export const BYOK_INFERENCE_PROVIDER_ID = 'bfl' as const;
export const BYOK_INFERENCE_PROVIDER_LABEL = 'Black Forest Labs';
export const BYOK_INFERENCE_PROVIDER_KEYWORD = 'black-forest-labs';
export const BYOK_MODEL_ID_PREFIX = `${BYOK_INFERENCE_PROVIDER_ID}/`;
export type ByokInferenceProviderId = typeof BYOK_INFERENCE_PROVIDER_ID;

export function isSherinModelId(value: unknown): value is SherinModelId {
  return (
    typeof value === 'string' && MODEL_IDS.includes(value as SherinModelId)
  );
}

/**
 * Aspect ratios offered in the studio. Each one maps to width/height that
 * BYOK's direct API needs. BabySea accepts the ratio string directly.
 */
export const RATIOS = {
  '1:1': { width: 1024, height: 1024 },
  '3:4': { width: 896, height: 1152 },
  '4:3': { width: 1152, height: 896 },
  '9:16': { width: 768, height: 1344 },
  '16:9': { width: 1344, height: 768 },
} as const satisfies Record<string, { width: number; height: number }>;

export type SherinDimensionRatio = keyof typeof RATIOS;

export const RATIO_OPTIONS = Object.keys(RATIOS) as SherinDimensionRatio[];

export const BFL_FLUX_11_PRO_ULTRA_RATIO_OPTIONS = [
  '1:1',
  '2:3',
  '3:2',
  '3:4',
  '4:3',
  '9:16',
  '9:21',
  '16:9',
  '21:9',
] as const;

export type BflFlux11ProUltraRatio =
  (typeof BFL_FLUX_11_PRO_ULTRA_RATIO_OPTIONS)[number];

export type SherinRatio = SherinDimensionRatio | BflFlux11ProUltraRatio;

export const BFL_OUTPUT_FORMATS = ['jpeg', 'png', 'webp'] as const;
export const OUTPUT_FORMATS = ['jpeg', 'jpg', 'png', 'webp'] as const;

export type SherinOutputFormat = (typeof OUTPUT_FORMATS)[number];

export const DEFAULT_RATIO: SherinDimensionRatio = '1:1';
export const DEFAULT_OUTPUT_FORMAT: SherinOutputFormat = 'jpeg';
export const RESOLUTION_OPTIONS = ['1MP', '2MP', '4MP'] as const;
export type SherinResolution = (typeof RESOLUTION_OPTIONS)[number];
export const DEFAULT_RESOLUTION: SherinResolution = '1MP';
export const GENERATION_PROMPT_PLACEHOLDER =
  'A cinematic editorial portrait with arctic light, soft film grain...';

export const DEFAULT_GENERATION_OUTPUT_NUMBER = 1;
export const DEFAULT_GENERATION_OUTPUT_QUALITY = 80;
export const DEFAULT_GENERATION_GUIDANCE_SCALE = 3.5;
export const DEFAULT_GENERATION_NUM_INFERENCE_STEPS = 28;
export const DEFAULT_BFL_FLUX_2_FLEX_GUIDANCE = 5;
export const DEFAULT_BFL_FLUX_2_FLEX_STEPS = 50;
export const DEFAULT_BYOK_GUIDANCE = DEFAULT_BFL_FLUX_2_FLEX_GUIDANCE;
export const DEFAULT_BYOK_STEPS = DEFAULT_BFL_FLUX_2_FLEX_STEPS;

export const BABYSEA_PROVIDER_ORDER_OPTIONS = [
  'fastest',
  'bfl, replicate, fal',
] as const;

export const BFL_DIMENSION_MIN = 256;
export const BFL_DIMENSION_MAX = 1440;
export const BFL_DIMENSION_STEP = 32;
export const BFL_SAFETY_TOLERANCES = [0, 1, 2, 3, 4, 5, 6] as const;
export type BflSafetyTolerance = (typeof BFL_SAFETY_TOLERANCES)[number];
export const DEFAULT_BFL_SAFETY_TOLERANCE: BflSafetyTolerance = 2;
export const DEFAULT_BYOK_SAFETY_TOLERANCE = DEFAULT_BFL_SAFETY_TOLERANCE;

export const BFL_FLUX_2_DIMENSION_MIN = 64;
export const BFL_FLUX_2_DIMENSION_STEP = 1;
export const BFL_FLUX_2_SAFETY_TOLERANCES = [0, 1, 2, 3, 4, 5] as const;
export const BFL_FLUX_2_MODEL_IDS = [
  'bfl/flux-2-flex',
  'bfl/flux-2-klein-4b',
  'bfl/flux-2-klein-9b',
  'bfl/flux-2-max',
  'bfl/flux-2-pro',
] as const satisfies readonly SherinModelId[];
export type BflFlux2ModelId = (typeof BFL_FLUX_2_MODEL_IDS)[number];

export const BFL_FLUX_2_INPUT_FILE_LIMITS = {
  'bfl/flux-2-flex': 8,
  'bfl/flux-2-klein-4b': 4,
  'bfl/flux-2-klein-9b': 4,
  'bfl/flux-2-max': 8,
  'bfl/flux-2-pro': 8,
} as const satisfies Record<BflFlux2ModelId, number>;

export const BABYSEA_FLUX_2_INPUT_FILE_LIMIT = 3;

export const BFL_FLUX_2_SIZE_MAP = {
  '1MP': {
    '1:1': { width: 1024, height: 1024 },
    '3:4': { width: 896, height: 1152 },
    '4:3': { width: 1152, height: 896 },
    '9:16': { width: 768, height: 1344 },
    '16:9': { width: 1344, height: 768 },
  },
  '2MP': {
    '1:1': { width: 1440, height: 1440 },
    '3:4': { width: 1264, height: 1632 },
    '4:3': { width: 1632, height: 1264 },
    '9:16': { width: 1088, height: 1904 },
    '16:9': { width: 1904, height: 1088 },
  },
  '4MP': {
    '1:1': { width: 2048, height: 2048 },
    '3:4': { width: 1792, height: 2304 },
    '4:3': { width: 2304, height: 1792 },
    '9:16': { width: 1536, height: 2688 },
    '16:9': { width: 2688, height: 1536 },
  },
} as const satisfies Record<
  SherinResolution,
  Record<SherinDimensionRatio, { width: number; height: number }>
>;

export type BflSizingMode = 'dimensions' | 'aspectRatio';

export type BflModelConfig = {
  endpoint: string;
  inputFileLimit: number;
  outputFormats: readonly string[];
  ratios: readonly string[];
  resolutions: readonly string[];
  defaultResolution?: string;
  safetyTolerances: readonly number[];
  dimension: {
    min: number;
    max?: number;
    step?: number;
  };
  supportsImagePrompt: boolean;
  supportsPromptUpsampling: boolean;
  defaultPromptUpsampling: boolean;
  supportsGuidance: boolean;
  supportsRaw: boolean;
  supportsSteps: boolean;
  sizingMode: BflSizingMode;
};

const BFL_FLUX_11_PRO_SHARED_CONFIG = {
  inputFileLimit: 0,
  outputFormats: BFL_OUTPUT_FORMATS,
  ratios: RATIO_OPTIONS,
  resolutions: [],
  defaultResolution: undefined,
  safetyTolerances: BFL_SAFETY_TOLERANCES,
  dimension: {
    min: BFL_DIMENSION_MIN,
    max: BFL_DIMENSION_MAX,
    step: BFL_DIMENSION_STEP,
  },
  supportsImagePrompt: false,
  supportsPromptUpsampling: true,
  defaultPromptUpsampling: false,
  supportsGuidance: false,
  supportsRaw: false,
  supportsSteps: false,
  sizingMode: 'dimensions',
} as const satisfies Omit<BflModelConfig, 'endpoint'>;

const BFL_FLUX_2_SHARED_CONFIG = {
  outputFormats: BFL_OUTPUT_FORMATS,
  ratios: RATIO_OPTIONS,
  resolutions: RESOLUTION_OPTIONS,
  defaultResolution: DEFAULT_RESOLUTION,
  safetyTolerances: BFL_FLUX_2_SAFETY_TOLERANCES,
  dimension: {
    min: BFL_FLUX_2_DIMENSION_MIN,
    step: BFL_FLUX_2_DIMENSION_STEP,
  },
  supportsImagePrompt: false,
  supportsPromptUpsampling: false,
  defaultPromptUpsampling: false,
  supportsGuidance: false,
  supportsRaw: false,
  supportsSteps: false,
  sizingMode: 'dimensions',
} as const satisfies Omit<BflModelConfig, 'endpoint' | 'inputFileLimit'>;

const BFL_FLUX_2_MODEL_CONFIGS = {
  'bfl/flux-2-flex': createBflFlux2ModelConfig('bfl/flux-2-flex', {
    supportsPromptUpsampling: true,
    defaultPromptUpsampling: true,
    supportsGuidance: true,
    supportsSteps: true,
  }),
  'bfl/flux-2-klein-4b': createBflFlux2ModelConfig('bfl/flux-2-klein-4b'),
  'bfl/flux-2-klein-9b': createBflFlux2ModelConfig('bfl/flux-2-klein-9b'),
  'bfl/flux-2-max': createBflFlux2ModelConfig('bfl/flux-2-max'),
  'bfl/flux-2-pro': createBflFlux2ModelConfig('bfl/flux-2-pro'),
} satisfies Record<BflFlux2ModelId, BflModelConfig>;

export const BFL_MODEL_CONFIGS = {
  'bfl/flux-1.1-pro': {
    ...BFL_FLUX_11_PRO_SHARED_CONFIG,
    endpoint: 'flux-pro-1.1',
  },
  'bfl/flux-1.1-pro-ultra': {
    ...BFL_FLUX_11_PRO_SHARED_CONFIG,
    endpoint: 'flux-pro-1.1-ultra',
    ratios: BFL_FLUX_11_PRO_ULTRA_RATIO_OPTIONS,
    supportsRaw: true,
    sizingMode: 'aspectRatio',
  },
  ...BFL_FLUX_2_MODEL_CONFIGS,
} as const satisfies Partial<Record<SherinModelId, BflModelConfig>>;

export const BFL_MODEL_IDS = MODEL_IDS.filter((model) =>
  hasBflModelConfig(model),
) as SherinModelId[];
export const BYOK_MODEL_CONFIGS = BFL_MODEL_CONFIGS;
export const BYOK_MODEL_IDS = BFL_MODEL_IDS;

export type BabySeaModelConfig = {
  identifier: string;
  inputFileLimit: number;
  outputFormatMap: Partial<Record<string, string>>;
  providerOrderOptions?: readonly string[];
};

const BABYSEA_MODEL_OVERRIDES: Partial<
  Record<SherinModelId, Partial<BabySeaModelConfig>>
> = {
  'bfl/flux-1.1-pro': {
    providerOrderOptions: BABYSEA_PROVIDER_ORDER_OPTIONS,
  },
};

export const BABYSEA_MODEL_CONFIGS = Object.fromEntries(
  MODEL_IDS.map((model) => [
    model,
    {
      identifier: model,
      inputFileLimit: isBflFlux2Model(model)
        ? BABYSEA_FLUX_2_INPUT_FILE_LIMIT
        : 1,
      outputFormatMap: { jpeg: 'jpg' },
      ...BABYSEA_MODEL_OVERRIDES[model],
    },
  ]),
) as Record<SherinModelId, BabySeaModelConfig>;

export const SHERIN_INPUT_FILE_LIMIT = Math.max(
  ...Object.values(BFL_FLUX_2_INPUT_FILE_LIMITS),
  ...Object.values(BABYSEA_MODEL_CONFIGS).map((model) => model.inputFileLimit),
);

export type InferenceProviderScope = 'babysea' | ByokInferenceProviderId | null;

function createBflFlux2ModelConfig(
  model: BflFlux2ModelId,
  overrides: Partial<Omit<BflModelConfig, 'endpoint' | 'inputFileLimit'>> = {},
): BflModelConfig {
  return {
    ...BFL_FLUX_2_SHARED_CONFIG,
    ...overrides,
    endpoint: model.replace('bfl/', ''),
    inputFileLimit: getBflFlux2InputFileLimit(model),
  };
}

export function hasBflModelConfig(
  model: SherinModelId,
): model is keyof typeof BFL_MODEL_CONFIGS & SherinModelId {
  return model in BFL_MODEL_CONFIGS;
}

export function hasByokModelConfig(
  model: SherinModelId,
): model is keyof typeof BYOK_MODEL_CONFIGS & SherinModelId {
  return hasBflModelConfig(model);
}

export function getModelOptionsForInferenceProvider(
  providerId: InferenceProviderScope,
) {
  if (providerId === 'bfl') {
    const bflModelIds = new Set<SherinModelId>(BFL_MODEL_IDS);

    return MODEL_OPTIONS.filter((option) => bflModelIds.has(option.id));
  }

  return MODEL_OPTIONS;
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
  if (providerId === 'bfl' && !hasBflModelConfig(DEFAULT_MODEL_ID)) {
    return BFL_MODEL_IDS[0] ?? DEFAULT_MODEL_ID;
  }

  return DEFAULT_MODEL_ID;
}

export function getBflFlux2Size(ratio: string, resolution: string | undefined) {
  const resolvedResolution = isSherinResolution(resolution)
    ? resolution
    : DEFAULT_RESOLUTION;

  return (
    BFL_FLUX_2_SIZE_MAP[resolvedResolution]?.[ratio as SherinDimensionRatio] ??
    BFL_FLUX_2_SIZE_MAP[DEFAULT_RESOLUTION][DEFAULT_RATIO]
  );
}

export function isBflFlux2Model(
  model: SherinModelId,
): model is BflFlux2ModelId {
  return (BFL_FLUX_2_MODEL_IDS as readonly SherinModelId[]).includes(model);
}

export function getBflFlux2InputFileLimit(model: BflFlux2ModelId) {
  return BFL_FLUX_2_INPUT_FILE_LIMITS[model];
}

export function getBabySeaInputFileLimit(model: SherinModelId) {
  return BABYSEA_MODEL_CONFIGS[model].inputFileLimit;
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
