import { Fragment, type ReactNode } from 'react';

import {
  DEFAULT_BYOK_GUIDANCE,
  DEFAULT_BYOK_SAFETY_TOLERANCE,
  DEFAULT_BYOK_STEPS,
  DEFAULT_GENERATION_OUTPUT_NUMBER,
} from '@/lib/app-config';
import { Input } from '@/components/ui/input';

import {
  Base64ImagePromptField,
  Field,
  InputImageUrlsField,
  NumberField,
  OutputFormatField,
  PromptField,
  RatioField,
  ResolutionField,
  Select,
  getFieldDescription,
} from './form-controls';

type ByokFormFieldsProps = {
  defaultDimensions?: { width: number; height: number };
  defaultOutputFormat: string;
  defaultPromptUpsampling: boolean;
  defaultRatio: string;
  defaultResolution?: string;
  dimension: {
    min: number;
    max?: number;
    step?: number;
  };
  inputFileLimit: number;
  onPromptChange: (prompt: string) => void;
  outputFormatOptions: string[];
  prompt: string;
  ratioOptions: string[];
  resolutionOptions: string[];
  safetyToleranceOptions: readonly number[];
  showDimensions: boolean;
  showGuidance: boolean;
  showImagePrompt: boolean;
  showPromptUpsampling: boolean;
  showRaw: boolean;
  showSteps: boolean;
};

export function ByokFormFields({
  defaultDimensions,
  defaultOutputFormat,
  defaultPromptUpsampling,
  defaultRatio,
  defaultResolution,
  dimension,
  inputFileLimit,
  onPromptChange,
  outputFormatOptions,
  prompt,
  ratioOptions,
  resolutionOptions,
  safetyToleranceOptions,
  showDimensions,
  showGuidance,
  showImagePrompt,
  showPromptUpsampling,
  showRaw,
  showSteps,
}: ByokFormFieldsProps) {
  const remainingFields: ExtraField[] = [
    {
      key: 'byok_safety_tolerance',
      label: 'Safety tolerance',
      node: (
        <Field
          label="Safety tolerance"
          description={getFieldDescription('byok_safety_tolerance')}
        >
          <Select
            name="byok_safety_tolerance"
            defaultValue={String(DEFAULT_BYOK_SAFETY_TOLERANCE)}
            options={safetyToleranceOptions.map((value) => ({
              value: String(value),
            }))}
          />
        </Field>
      ),
    },
    {
      key: 'byok_seed',
      label: 'Seed',
      node: (
        <NumberField
          description={getFieldDescription('byok_seed')}
          label="Seed"
          name="byok_seed"
          min={0}
          max={2_147_483_647}
        />
      ),
    },
  ];

  if (showPromptUpsampling) {
    remainingFields.push({
      key: 'byok_prompt_upsampling',
      label: 'Prompt upsampling',
      node: (
        <Field
          label="Prompt upsampling"
          description={getFieldDescription('byok_prompt_upsampling')}
        >
          <Select
            name="byok_prompt_upsampling"
            defaultValue={String(defaultPromptUpsampling)}
            options={[
              { value: 'false', label: 'Off' },
              { value: 'true', label: 'On' },
            ]}
          />
        </Field>
      ),
    });
  }

  if (showRaw) {
    remainingFields.push({
      key: 'byok_raw',
      label: 'Raw mode',
      node: (
        <Field label="Raw mode" description={getFieldDescription('byok_raw')}>
          <Select
            name="byok_raw"
            defaultValue="false"
            options={[
              { value: 'false', label: 'Off' },
              { value: 'true', label: 'On' },
            ]}
          />
        </Field>
      ),
    });
  }

  if (showGuidance) {
    remainingFields.push({
      key: 'byok_guidance_scale',
      label: 'Guidance scale',
      node: (
        <NumberField
          defaultValue={DEFAULT_BYOK_GUIDANCE}
          description={getFieldDescription('byok_guidance_scale')}
          label="Guidance scale"
          name="byok_guidance_scale"
          min={1.5}
          max={10}
          step="0.1"
        />
      ),
    });
  }

  if (showSteps) {
    remainingFields.push({
      key: 'byok_num_inference_steps',
      label: 'Inference steps',
      node: (
        <NumberField
          defaultValue={DEFAULT_BYOK_STEPS}
          description={getFieldDescription('byok_num_inference_steps')}
          label="Inference steps"
          name="byok_num_inference_steps"
          min={1}
          max={50}
        />
      ),
    });
  }

  remainingFields.sort((left, right) => left.label.localeCompare(right.label));

  return (
    <div className="space-y-5">
      <PromptField prompt={prompt} onPromptChange={onPromptChange} />

      <div className="grid gap-3 sm:grid-cols-2">
        <RatioField
          defaultRatio={defaultRatio}
          label="Aspect ratio"
          ratioOptions={ratioOptions}
        />

        <OutputFormatField
          defaultOutputFormat={defaultOutputFormat}
          outputFormatOptions={outputFormatOptions}
        />

        <Field
          label="Number of images"
          description={getFieldDescription('generation_output_number')}
        >
          <Input
            readOnly
            name="generation_output_number"
            type="number"
            value={DEFAULT_GENERATION_OUTPUT_NUMBER}
            className="cursor-not-allowed text-slate-300"
          />
        </Field>

        {resolutionOptions.length > 0 ? (
          <ResolutionField
            defaultResolution={defaultResolution ?? resolutionOptions[0] ?? ''}
            resolutionOptions={resolutionOptions}
          />
        ) : null}

        {showDimensions ? (
          <>
            <Field
              label="Width"
              description={getFieldDescription('byok_width')}
            >
              <Input
                name="byok_width"
                type="number"
                min={dimension.min}
                max={dimension.max}
                step={dimension.step}
                defaultValue={defaultDimensions?.width}
                placeholder={defaultDimensions ? undefined : 'Optional'}
              />
            </Field>

            <Field
              label="Height"
              description={getFieldDescription('byok_height')}
            >
              <Input
                name="byok_height"
                type="number"
                min={dimension.min}
                max={dimension.max}
                step={dimension.step}
                defaultValue={defaultDimensions?.height}
                placeholder={defaultDimensions ? undefined : 'Optional'}
              />
            </Field>
          </>
        ) : null}

        {showImagePrompt ? (
          <Base64ImagePromptField
            descriptionKey="byok_image_prompt"
            name="byok_image_prompt"
          />
        ) : null}

        {inputFileLimit > 0 ? (
          <InputImageUrlsField
            descriptionKey="byok_image_input_urls"
            maxUrls={inputFileLimit}
            name="generation_input_file"
          />
        ) : null}

        {remainingFields.map((field) => (
          <Fragment key={field.key}>{field.node}</Fragment>
        ))}
      </div>
    </div>
  );
}

type ExtraField = {
  key: string;
  label: string;
  node: ReactNode;
};
