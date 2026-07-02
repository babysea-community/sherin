'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  BYOK_MODEL_CONFIGS,
  DEFAULT_MODEL_ID,
  DEFAULT_OUTPUT_FORMAT,
  DEFAULT_RATIO,
  MODEL_OPTIONS,
  getBabySeaInputFileLimit,
  getModelOptionsForByokProviders,
  hasByokModelConfig,
  isSherinModelId,
  type ByokInferenceProviderId,
  type SherinModelId,
} from '@/lib/app-config';
import type { BabySeaStudioModelSchema } from '@/lib/inference/babysea/server-actions';

import { BabySeaFormFields } from './babysea-form-fields';
import { ByokFormFields } from './byok-form-fields';
import { ModelField } from './form-controls';

type StudioModelFieldsProps = {
  mode: 'babysea' | 'byok' | null;
  byokProviderIds: readonly ByokInferenceProviderId[];
  babySeaSchemas: Partial<Record<SherinModelId, BabySeaStudioModelSchema>>;
  initialModel?: SherinModelId;
  initialPrompt?: string;
};

const STUDIO_FORM_DRAFT_KEY = 'sherin:studio-form-draft:v1';
const STUDIO_FORM_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

export function StudioModelFields({
  mode,
  byokProviderIds,
  babySeaSchemas,
  initialModel,
  initialPrompt,
}: StudioModelFieldsProps) {
  const modelOptions = useMemo(() => {
    if (mode === 'babysea') {
      const babySeaModelIds = new Set(Object.keys(babySeaSchemas));

      return MODEL_OPTIONS.filter((option) => babySeaModelIds.has(option.id));
    }

    return getModelOptionsForByokProviders(byokProviderIds);
  }, [mode, babySeaSchemas, byokProviderIds]);
  const fallbackModel = modelOptions[0]?.id ?? DEFAULT_MODEL_ID;
  const [model, setModel] = useState<SherinModelId>(
    initialModel && isModelOption(initialModel, modelOptions)
      ? initialModel
      : fallbackModel,
  );
  const [prompt, setPrompt] = useState(initialPrompt ?? '');
  const [draftReady, setDraftReady] = useState(false);
  const selectedModel = isModelOption(model, modelOptions)
    ? model
    : fallbackModel;
  const byokConfig = hasByokModelConfig(selectedModel)
    ? BYOK_MODEL_CONFIGS[selectedModel]
    : null;
  const babySeaSchema = babySeaSchemas[selectedModel];

  useEffect(() => {
    const draft = readStudioFormDraft();

    if (draft?.model && isModelOption(draft.model, modelOptions)) {
      setModel(draft.model);
    }

    if (draft?.prompt !== undefined) {
      setPrompt(draft.prompt);
    }

    setDraftReady(true);
  }, [modelOptions]);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    writeStudioFormDraft({ model: selectedModel, prompt });
  }, [draftReady, selectedModel, prompt]);

  return (
    <div className="space-y-5">
      <ModelField
        model={selectedModel}
        modelOptions={modelOptions}
        onModelChange={setSelectedModel}
      />

      {mode === 'babysea' && babySeaSchema ? (
        <BabySeaFormFields
          key={`babysea-${selectedModel}`}
          defaultOutputFormat={defaultValue(
            babySeaSchema.outputFormats,
            DEFAULT_OUTPUT_FORMAT,
          )}
          defaultProviderOrder={
            babySeaSchema.providerOrderOptions[0] ?? 'fastest'
          }
          defaultRatio={defaultValue(babySeaSchema.ratios, DEFAULT_RATIO)}
          defaultResolution={babySeaSchema.defaultResolution}
          inputFile={Boolean(babySeaSchema.inputFile)}
          inputFileLimit={getBabySeaInputFileLimit(selectedModel)}
          onPromptChange={setPrompt}
          outputFormatOptions={babySeaSchema.outputFormats}
          outputNumber={babySeaSchema.outputNumber}
          prompt={prompt}
          providerOrderOptions={babySeaSchema.providerOrderOptions}
          ratioOptions={babySeaSchema.ratios}
          resolutionOptions={babySeaSchema.resolutions}
          specificSchema={babySeaSchema.specificSchema}
        />
      ) : null}

      {mode !== 'babysea' && byokConfig ? (
        <ByokFormFields
          key={`byok-${selectedModel}`}
          defaultOutputFormat={defaultValue(
            byokConfig.outputFormats,
            DEFAULT_OUTPUT_FORMAT,
          )}
          defaultRatio={defaultValue(
            byokConfig.ratios,
            byokConfig.defaultRatio,
          )}
          inputFileLimit={byokConfig.inputImageLimit}
          onPromptChange={setPrompt}
          outputFormatOptions={[...byokConfig.outputFormats]}
          prompt={prompt}
          ratioOptions={[...byokConfig.ratios]}
          schema={byokConfig.schema}
          videoInputFileLimit={byokConfig.inputVideoLimit}
        />
      ) : null}
    </div>
  );

  function setSelectedModel(nextModel: SherinModelId) {
    setModel(nextModel);
  }
}

function readStudioFormDraft(): {
  model?: SherinModelId;
  prompt?: string;
} | null {
  try {
    const raw = window.sessionStorage.getItem(STUDIO_FORM_DRAFT_KEY);

    if (!raw) {
      return null;
    }

    const value = JSON.parse(raw) as Record<string, unknown>;
    const updatedAt =
      typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
        ? value.updatedAt
        : 0;

    if (Date.now() - updatedAt > STUDIO_FORM_DRAFT_TTL_MS) {
      window.sessionStorage.removeItem(STUDIO_FORM_DRAFT_KEY);

      return null;
    }

    const model = toSherinModelId(value.model);
    const prompt = typeof value.prompt === 'string' ? value.prompt : undefined;

    return {
      ...(model ? { model } : {}),
      ...(prompt !== undefined ? { prompt } : {}),
    };
  } catch {
    window.sessionStorage.removeItem(STUDIO_FORM_DRAFT_KEY);

    return null;
  }
}

function writeStudioFormDraft({
  model,
  prompt,
}: {
  model: SherinModelId;
  prompt: string;
}) {
  try {
    window.sessionStorage.setItem(
      STUDIO_FORM_DRAFT_KEY,
      JSON.stringify({ model, prompt, updatedAt: Date.now() }),
    );
  } catch {
    return;
  }
}

function toSherinModelId(value: unknown): SherinModelId | undefined {
  return isSherinModelId(value) ? value : undefined;
}

function isModelOption(
  value: SherinModelId,
  modelOptions: readonly { id: SherinModelId }[],
) {
  return modelOptions.some((option) => option.id === value);
}

function defaultValue(values: readonly string[], preferred: string) {
  return values.includes(preferred) ? preferred : (values[0] ?? preferred);
}
