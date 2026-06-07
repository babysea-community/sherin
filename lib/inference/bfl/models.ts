import { BFL_MODEL_CONFIGS, type SherinModelId } from '@/lib/app-config';

export { BFL_MODEL_CONFIGS, type BflModelConfig } from '@/lib/app-config';

export function resolveBflModelConfig(model: SherinModelId) {
  const config = BFL_MODEL_CONFIGS[model];

  if (!config) {
    throw new Error(`Black Forest Labs does not support model ${model}.`);
  }

  return config;
}

export function resolveBflModelEndpoint(model: SherinModelId) {
  return resolveBflModelConfig(model).endpoint;
}
