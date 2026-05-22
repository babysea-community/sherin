'use client';

import { useEffect, useState } from 'react';

import {
  DEFAULT_MODEL_ID,
  DEFAULT_OUTPUT_FORMAT,
  DEFAULT_RATIO,
  MODEL_OPTIONS,
  RATIOS,
  getBabySeaInputFileLimit,
  type SherinModelId,
} from '@/lib/app-config';
import { BFL_MODEL_CONFIGS } from '@/lib/inference/bfl/models';
import type { BabySeaStudioModelSchema } from '@/lib/inference/babysea/server-actions';

import { BabySeaFormFields } from './babysea-form-fields';
import { BflFormFields } from './bfl-form-fields';
import { ModelField } from './form-controls';

type StudioModelFieldsProps = {
  activeProvider: 'babysea' | 'bfl' | null;
  babySeaSchemas: Partial<Record<SherinModelId, BabySeaStudioModelSchema>>;
  initialModel?: SherinModelId;
  initialPrompt?: string;
};

const STUDIO_FORM_DRAFT_KEY = 'sherin:studio-form-draft:v1';
const STUDIO_FORM_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

export function StudioModelFields({
  activeProvider,
  babySeaSchemas,
  initialModel,
  initialPrompt,
}: StudioModelFieldsProps) {
  const [model, setModel] = useState<SherinModelId>(
    initialModel ?? DEFAULT_MODEL_ID,
  );
  const [prompt, setPrompt] = useState(initialPrompt ?? '');
  const [draftReady, setDraftReady] = useState(false);
  const bflConfig = BFL_MODEL_CONFIGS[model];
  const babySeaSchema = babySeaSchemas[model];
  const showBflDimensions = bflConfig.sizingMode === 'dimensions';
  const bflDefaultDimensions =
    showBflDimensions && bflConfig.resolutions.length === 0
      ? RATIOS[
          defaultValue(bflConfig.ratios, DEFAULT_RATIO) as keyof typeof RATIOS
        ]
      : undefined;

  useEffect(() => {
    const draft = readStudioFormDraft();

    if (draft?.model) {
      setModel(draft.model);
    }

    if (draft?.prompt !== undefined) {
      setPrompt(draft.prompt);
    }

    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    writeStudioFormDraft({ model, prompt });
  }, [draftReady, model, prompt]);

  return (
    <div className="space-y-5">
      <ModelField model={model} onModelChange={setSelectedModel} />

      {activeProvider === 'babysea' && babySeaSchema ? (
        <BabySeaFormFields
          key={`babysea-${model}`}
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
          inputFileLimit={getBabySeaInputFileLimit(model)}
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

      {activeProvider === 'bfl' || !activeProvider ? (
        <BflFormFields
          key={`bfl-${model}`}
          defaultDimensions={bflDefaultDimensions}
          defaultOutputFormat={defaultValue(
            bflConfig.outputFormats,
            DEFAULT_OUTPUT_FORMAT,
          )}
          defaultPromptUpsampling={bflConfig.defaultPromptUpsampling}
          defaultRatio={defaultValue(bflConfig.ratios, DEFAULT_RATIO)}
          defaultResolution={bflConfig.defaultResolution}
          dimension={bflConfig.dimension}
          inputFileLimit={bflConfig.inputFileLimit}
          onPromptChange={setPrompt}
          outputFormatOptions={[...bflConfig.outputFormats]}
          prompt={prompt}
          ratioOptions={[...bflConfig.ratios]}
          resolutionOptions={[...bflConfig.resolutions]}
          safetyToleranceOptions={bflConfig.safetyTolerances}
          showDimensions={showBflDimensions}
          showGuidance={bflConfig.supportsGuidance}
          showImagePrompt={bflConfig.supportsImagePrompt}
          showPromptUpsampling={bflConfig.supportsPromptUpsampling}
          showRaw={bflConfig.supportsRaw}
          showSteps={bflConfig.supportsSteps}
        />
      ) : null}
    </div>
  );

  function setSelectedModel(value: string) {
    const nextModel = toSherinModelId(value);

    if (nextModel) {
      setModel(nextModel);
    }
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
  return typeof value === 'string'
    ? MODEL_OPTIONS.find((option) => option.id === value)?.id
    : undefined;
}

function defaultValue(values: readonly string[], preferred: string) {
  return values.includes(preferred) ? preferred : (values[0] ?? preferred);
}
