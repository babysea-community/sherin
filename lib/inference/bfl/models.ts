import {
  BFL_DIMENSION_MAX,
  BFL_DIMENSION_MIN,
  BFL_DIMENSION_STEP,
  BFL_FLUX_11_PRO_ULTRA_RATIO_OPTIONS,
  BFL_FLUX_2_DIMENSION_MIN,
  BFL_FLUX_2_DIMENSION_STEP,
  BFL_FLUX_2_SAFETY_TOLERANCES,
  BFL_OUTPUT_FORMATS,
  BFL_SAFETY_TOLERANCES,
  DEFAULT_RESOLUTION,
  RATIO_OPTIONS,
  RESOLUTION_OPTIONS,
  getBflFlux2InputFileLimit,
  type BflFlux2ModelId,
  type SherinModelId,
} from '@/lib/app-config';

type BflSizingMode = 'dimensions' | 'aspectRatio';

type BflModelConfig = {
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
  'bfl/flux-2-pro': createBflFlux2ModelConfig('bfl/flux-2-pro'),
  'bfl/flux-2-max': createBflFlux2ModelConfig('bfl/flux-2-max'),
  'bfl/flux-2-flex': createBflFlux2ModelConfig('bfl/flux-2-flex', {
    supportsPromptUpsampling: true,
    defaultPromptUpsampling: true,
    supportsGuidance: true,
    supportsSteps: true,
  }),
  'bfl/flux-2-klein-4b': createBflFlux2ModelConfig('bfl/flux-2-klein-4b'),
  'bfl/flux-2-klein-9b': createBflFlux2ModelConfig('bfl/flux-2-klein-9b'),
} satisfies Record<BflFlux2ModelId, BflModelConfig>;

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
} as const satisfies Record<SherinModelId, BflModelConfig>;

export function resolveBflModelConfig(model: SherinModelId) {
  const config = BFL_MODEL_CONFIGS[model];

  if (!config) {
    throw new Error(`BFL does not support model ${model}.`);
  }

  return config;
}

export function resolveBflModelEndpoint(model: SherinModelId) {
  return resolveBflModelConfig(model).endpoint;
}
