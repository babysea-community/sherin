import { describe, expect, it } from 'vitest';

import {
  BFL_FLUX_11_PRO_ULTRA_RATIO_OPTIONS,
  BFL_MODEL_IDS,
  DEFAULT_MODEL_ID,
  BFL_FLUX_2_MODEL_IDS,
  MODEL_IDS,
  MODEL_OPTIONS,
  RATIO_OPTIONS,
  RESOLUTION_OPTIONS,
  getDefaultModelIdForInferenceProvider,
  getBabySeaInputFileLimit,
  getBflFlux2InputFileLimit,
  getModelIdsForInferenceProvider,
  getModelOptionsForInferenceProvider,
  isBflFlux2Model,
  type BflFlux2ModelId,
} from '@/lib/app-config';
import { resolveBabySeaModelIdentifier } from '@/lib/inference/babysea/models';
import {
  resolveBflModelConfig,
  resolveBflModelEndpoint,
} from '@/lib/inference/bfl/models';

type Flux2ModelExpectation = {
  id: BflFlux2ModelId;
  label: string;
  endpoint: string;
  inputFileLimit: number;
  supportsPromptUpsampling: boolean;
  defaultPromptUpsampling: boolean;
  supportsGuidance: boolean;
  supportsSteps: boolean;
};

const FLUX_2_MODEL_EXPECTATIONS: Flux2ModelExpectation[] = [
  {
    id: 'bfl/flux-2-flex',
    label: 'FLUX 2 Flex',
    endpoint: 'flux-2-flex',
    inputFileLimit: 8,
    supportsPromptUpsampling: true,
    defaultPromptUpsampling: true,
    supportsGuidance: true,
    supportsSteps: true,
  },
  {
    id: 'bfl/flux-2-klein-4b',
    label: 'FLUX 2 Klein 4B',
    endpoint: 'flux-2-klein-4b',
    inputFileLimit: 4,
    supportsPromptUpsampling: false,
    defaultPromptUpsampling: false,
    supportsGuidance: false,
    supportsSteps: false,
  },
  {
    id: 'bfl/flux-2-klein-9b',
    label: 'FLUX 2 Klein 9B',
    endpoint: 'flux-2-klein-9b',
    inputFileLimit: 4,
    supportsPromptUpsampling: false,
    defaultPromptUpsampling: false,
    supportsGuidance: false,
    supportsSteps: false,
  },
  {
    id: 'bfl/flux-2-max',
    label: 'FLUX 2 Max',
    endpoint: 'flux-2-max',
    inputFileLimit: 8,
    supportsPromptUpsampling: false,
    defaultPromptUpsampling: false,
    supportsGuidance: false,
    supportsSteps: false,
  },
  {
    id: 'bfl/flux-2-pro',
    label: 'FLUX 2 Pro',
    endpoint: 'flux-2-pro',
    inputFileLimit: 8,
    supportsPromptUpsampling: false,
    defaultPromptUpsampling: false,
    supportsGuidance: false,
    supportsSteps: false,
  },
];

describe('Sherin model registry', () => {
  it('derives provider model options from the central registry', () => {
    expect(getModelOptionsForInferenceProvider('babysea')).toEqual(
      MODEL_OPTIONS,
    );
    expect(getModelIdsForInferenceProvider('babysea')).toEqual(MODEL_IDS);
    expect(getModelIdsForInferenceProvider('bfl')).toEqual(BFL_MODEL_IDS);
    expect(getDefaultModelIdForInferenceProvider('babysea')).toBe(
      DEFAULT_MODEL_ID,
    );
    expect(getDefaultModelIdForInferenceProvider('bfl')).toBe(DEFAULT_MODEL_ID);
  });

  it('registers the BFL FLUX 2 family across the Studio providers', () => {
    expect(BFL_FLUX_2_MODEL_IDS).toEqual(
      FLUX_2_MODEL_EXPECTATIONS.map((model) => model.id),
    );

    for (const model of FLUX_2_MODEL_EXPECTATIONS) {
      expect(MODEL_IDS).toContain(model.id);
      expect(MODEL_OPTIONS.find((option) => option.id === model.id)).toEqual({
        id: model.id,
        label: model.label,
      });
      expect(isBflFlux2Model(model.id)).toBe(true);
      expect(resolveBflModelEndpoint(model.id)).toBe(model.endpoint);
      expect(resolveBabySeaModelIdentifier(model.id)).toBe(model.id);
      expect(getBabySeaInputFileLimit(model.id)).toBe(3);
      expect(getBflFlux2InputFileLimit(model.id)).toBe(model.inputFileLimit);

      const bflConfig = resolveBflModelConfig(model.id);

      expect(bflConfig.inputFileLimit).toBe(model.inputFileLimit);
      expect(bflConfig.resolutions).toEqual(RESOLUTION_OPTIONS);
      expect(bflConfig.sizingMode).toBe('dimensions');
      expect(bflConfig.supportsImagePrompt).toBe(false);
      expect(bflConfig.supportsPromptUpsampling).toBe(
        model.supportsPromptUpsampling,
      );
      expect(bflConfig.defaultPromptUpsampling).toBe(
        model.defaultPromptUpsampling,
      );
      expect(bflConfig.supportsGuidance).toBe(model.supportsGuidance);
      expect(bflConfig.supportsRaw).toBe(false);
      expect(bflConfig.supportsSteps).toBe(model.supportsSteps);
    }
  });

  it('registers FLUX 1.1 Pro Ultra with direct BFL aspect-ratio sizing', () => {
    const model = 'bfl/flux-1.1-pro-ultra';

    expect(MODEL_IDS).toContain(model);
    expect(MODEL_OPTIONS.find((option) => option.id === model)).toEqual({
      id: model,
      label: 'FLUX 1.1 Pro Ultra',
    });
    expect(isBflFlux2Model(model)).toBe(false);
    expect(resolveBabySeaModelIdentifier(model)).toBe(model);
    expect(resolveBflModelEndpoint(model)).toBe('flux-pro-1.1-ultra');

    const bflConfig = resolveBflModelConfig(model);

    expect(bflConfig.inputFileLimit).toBe(0);
    expect(bflConfig.ratios).toEqual(BFL_FLUX_11_PRO_ULTRA_RATIO_OPTIONS);
    expect(bflConfig.resolutions).toEqual([]);
    expect(bflConfig.sizingMode).toBe('aspectRatio');
    expect(bflConfig.supportsImagePrompt).toBe(false);
    expect(bflConfig.supportsPromptUpsampling).toBe(true);
    expect(bflConfig.defaultPromptUpsampling).toBe(false);
    expect(bflConfig.supportsGuidance).toBe(false);
    expect(bflConfig.supportsRaw).toBe(true);
    expect(bflConfig.supportsSteps).toBe(false);
  });

  it('keeps BabySea model identifiers derived from Sherin model ids', () => {
    for (const model of MODEL_IDS) {
      expect(resolveBabySeaModelIdentifier(model)).toBe(model);
    }
  });

  it('keeps FLUX 1.1 Pro on the shared dimension-based BFL contract', () => {
    const bflConfig = resolveBflModelConfig('bfl/flux-1.1-pro');

    expect(bflConfig.endpoint).toBe('flux-pro-1.1');
    expect(bflConfig.ratios).toEqual(RATIO_OPTIONS);
    expect(bflConfig.resolutions).toEqual([]);
    expect(bflConfig.sizingMode).toBe('dimensions');
    expect(bflConfig.supportsImagePrompt).toBe(false);
    expect(bflConfig.supportsPromptUpsampling).toBe(true);
    expect(bflConfig.defaultPromptUpsampling).toBe(false);
    expect(bflConfig.supportsRaw).toBe(false);
  });
});
