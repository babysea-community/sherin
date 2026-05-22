/**
 * Sherin app-wide constants.
 *
 * Sherin ships with a small model registry. Add more by extending the options
 * below and mapping them in each inference provider's `models.ts` file.
 */
export const APP_NAME = 'Sherin';
export const APP_PORT = 3012;

export const MODEL_OPTIONS = [
  { id: 'bfl/flux-1.1-pro', label: 'FLUX 1.1 Pro' },
  { id: 'bfl/flux-1.1-pro-ultra', label: 'FLUX 1.1 Pro Ultra' },
  { id: 'bfl/flux-2-pro', label: 'FLUX 2 Pro' },
  { id: 'bfl/flux-2-max', label: 'FLUX 2 Max' },
  { id: 'bfl/flux-2-flex', label: 'FLUX 2 Flex' },
  { id: 'bfl/flux-2-klein-4b', label: 'FLUX 2 Klein 4B' },
  { id: 'bfl/flux-2-klein-9b', label: 'FLUX 2 Klein 9B' },
] as const;

export type SherinModelId = (typeof MODEL_OPTIONS)[number]['id'];

export const MODEL_IDS = MODEL_OPTIONS.map((model) => model.id) as [
  SherinModelId,
  ...SherinModelId[],
];

export const DEFAULT_MODEL_ID: SherinModelId = 'bfl/flux-1.1-pro';

/**
 * Aspect ratios offered in the studio. Each one maps to width/height that
 * BFL's direct API needs. BabySea accepts the ratio string directly.
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

export const BFL_FLUX_2_DIMENSION_MIN = 64;
export const BFL_FLUX_2_DIMENSION_STEP = 1;
export const BFL_FLUX_2_SAFETY_TOLERANCES = [0, 1, 2, 3, 4, 5] as const;
export const BFL_FLUX_2_MODEL_IDS = [
  'bfl/flux-2-pro',
  'bfl/flux-2-max',
  'bfl/flux-2-flex',
  'bfl/flux-2-klein-4b',
  'bfl/flux-2-klein-9b',
] as const satisfies readonly SherinModelId[];
export type BflFlux2ModelId = (typeof BFL_FLUX_2_MODEL_IDS)[number];

export const BFL_FLUX_2_INPUT_FILE_LIMITS = {
  'bfl/flux-2-pro': 8,
  'bfl/flux-2-max': 8,
  'bfl/flux-2-flex': 8,
  'bfl/flux-2-klein-4b': 4,
  'bfl/flux-2-klein-9b': 4,
} as const satisfies Record<BflFlux2ModelId, number>;
export const BABYSEA_FLUX_2_INPUT_FILE_LIMIT = 3;
export const SHERIN_INPUT_FILE_LIMIT = Math.max(
  ...Object.values(BFL_FLUX_2_INPUT_FILE_LIMITS),
  BABYSEA_FLUX_2_INPUT_FILE_LIMIT,
);

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
  if (isBflFlux2Model(model)) {
    return BABYSEA_FLUX_2_INPUT_FILE_LIMIT;
  }

  return 1;
}

export function isSherinResolution(
  value: string | undefined,
): value is SherinResolution {
  return RESOLUTION_OPTIONS.includes(value as SherinResolution);
}
