import { MODEL_IDS, type SherinModelId } from '@/lib/app-config';

type BabySeaModelConfig = {
  identifier: SherinModelId;
};

export const BABYSEA_MODELS = Object.fromEntries(
  MODEL_IDS.map((identifier) => [identifier, { identifier }]),
) as Record<SherinModelId, BabySeaModelConfig>;

export function resolveBabySeaModel(model: SherinModelId) {
  const config = BABYSEA_MODELS[model];

  if (!config) {
    throw new Error(`BabySea does not support model ${model}.`);
  }

  return config;
}

export function resolveBabySeaModelIdentifier(model: SherinModelId) {
  return resolveBabySeaModel(model).identifier;
}

export function resolveBabySeaOutputFormat(
  model: SherinModelId,
  outputFormat: string,
) {
  resolveBabySeaModel(model);

  return outputFormat === 'jpeg' ? 'jpg' : outputFormat;
}
