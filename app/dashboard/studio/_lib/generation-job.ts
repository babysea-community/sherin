import { randomUUID } from 'node:crypto';

import { z } from 'zod';

import {
  BFL_DIMENSION_MIN,
  BFL_FLUX_2_DIMENSION_MIN,
  BFL_SAFETY_TOLERANCES,
  DEFAULT_BFL_SAFETY_TOLERANCE,
  DEFAULT_GENERATION_OUTPUT_NUMBER,
  MODEL_IDS,
  SHERIN_INPUT_FILE_LIMIT,
  type BflSafetyTolerance,
} from '@/lib/app-config';
import type { Json } from '@/lib/database.types';
import type { StoredInputFileAsset } from './input-file-uploads';

const MAX_INPUT_FILES = SHERIN_INPUT_FILE_LIMIT;
const BABYSEA_SPECIFIC_FIELD_PREFIX = 'babysea:';
const BABYSEA_CORE_FIELD_NAMES = new Set([
  'generation_prompt',
  'generation_ratio',
  'generation_resolution',
  'generation_output_format',
  'generation_output_number',
  'generation_input_file',
  'generation_provider_order',
]);

const BabySeaSpecificValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
]);

const InputFilesSchema = z.array(z.string().trim().min(1)).max(MAX_INPUT_FILES);
const InputFileUploadPathsSchema = z
  .array(z.string().trim().min(1))
  .max(MAX_INPUT_FILES);
const StorageProviderIdSchema = z.enum([
  'supabase-storage',
  'vercel-blob',
  'cloudflare-r2',
  'aws-s3',
]);
const StoredInputFileAssetSchema = z.object({
  byteLength: z.number().int().nonnegative(),
  contentType: z.string().trim().min(1),
  fallbackFromProviderId: StorageProviderIdSchema.optional(),
  fallbackReason: z.string().optional(),
  originalUrl: z.string().url().optional(),
  publicUrl: z.string().url().nullable(),
  source: z.enum(['upload', 'url']),
  storagePath: z.string().trim().min(1),
  storageProvider: StorageProviderIdSchema,
  url: z.string().url(),
});
const StoredInputFileAssetsSchema = z
  .array(StoredInputFileAssetSchema)
  .max(MAX_INPUT_FILES);

const GenerationInputShape = {
  model: z.enum(MODEL_IDS),
  prompt: z.string().trim().min(3).max(2000),
  ratio: z.string().trim().min(1).max(16),
  generation_resolution: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1).max(32).optional(),
  ),
  output_format: z.string().trim().min(1).max(16),
  generation_output_number: z.coerce
    .number()
    .int()
    .min(DEFAULT_GENERATION_OUTPUT_NUMBER)
    .max(16),
  generation_provider_order: z.string().trim().min(1).max(160),
  generation_input_file: InputFilesSchema,
  bfl_image_prompt: optionalTrimmedString(),
  bfl_width: optionalBflDimension(),
  bfl_height: optionalBflDimension(),
  bfl_prompt_upsampling: z.boolean(),
  bfl_guidance_scale: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().min(1.5).max(10).optional(),
  ),
  bfl_num_inference_steps: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().min(1).max(50).optional(),
  ),
  bfl_raw: z.boolean().default(false),
  bfl_seed: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().min(0).max(2_147_483_647).optional(),
  ),
  bfl_safety_tolerance: z.coerce
    .number()
    .default(DEFAULT_BFL_SAFETY_TOLERANCE)
    .pipe(
      z.custom<BflSafetyTolerance>((value) =>
        BFL_SAFETY_TOLERANCES.includes(value as BflSafetyTolerance),
      ),
    ),
};

export const GenerationInputSchema = z
  .object(GenerationInputShape)
  .superRefine(validateBflDimensions);

export const GenerateFormSchema = z
  .object({
    ...GenerationInputShape,
    generation_input_file: z.preprocess(parseInputFiles, InputFilesSchema),
  })
  .superRefine(validateBflDimensions);

export const QueuedGenerationJobSchema = z.object({
  version: z.literal(1),
  babyseaIdempotencyKey: z.string().uuid().optional(),
  values: GenerationInputSchema,
  babyseaSpecificParams: z.record(BabySeaSpecificValueSchema),
  initialStorageProvider: z.string().min(1),
  inputFileAssets: StoredInputFileAssetsSchema.default([]),
  inputFileUploadPaths: InputFileUploadPathsSchema.default([]),
});

export type GenerationInput = z.infer<typeof GenerationInputSchema>;
export type QueuedGenerationJob = z.infer<typeof QueuedGenerationJobSchema>;

export function createQueuedGenerationJob(
  values: GenerationInput,
  babyseaSpecificParams: Record<string, string | number | boolean>,
  initialStorageProvider: string,
  inputFileAssets: StoredInputFileAsset[] = [],
  inputFileUploadPaths: string[] = [],
) {
  return toJsonParsedJob({
    version: 1,
    babyseaIdempotencyKey: randomUUID(),
    values,
    babyseaSpecificParams,
    initialStorageProvider,
    inputFileAssets,
    inputFileUploadPaths,
  });
}

export function readQueuedGenerationInputFileAssets(metadata: Json | null) {
  try {
    return readQueuedGenerationJob(metadata).inputFileAssets;
  } catch {
    return [];
  }
}

export function readQueuedGenerationInputFileUploadPaths(
  metadata: Json | null,
) {
  try {
    return readQueuedGenerationJob(metadata).inputFileUploadPaths;
  } catch {
    return [];
  }
}

export function readQueuedGenerationJob(metadata: Json | null) {
  const record = toMetadataRecord(metadata);
  const job = record?.sherin_job;

  if (!job) {
    throw new Error('Generation row does not include a durable job payload.');
  }

  return QueuedGenerationJobSchema.parse(job);
}

export function parseBabySeaSpecificParams(
  formData: FormData,
  specificSchema: string[],
) {
  const params: Record<string, string | number | boolean> = {};
  const allowedSpecificFields = new Set(specificSchema);

  for (const [name, rawValue] of formData.entries()) {
    if (!name.startsWith(BABYSEA_SPECIFIC_FIELD_PREFIX)) {
      continue;
    }

    if (typeof rawValue !== 'string') {
      continue;
    }

    const key = name.slice(BABYSEA_SPECIFIC_FIELD_PREFIX.length);
    const value = rawValue.trim();

    if (!key || !value) {
      continue;
    }

    if (BABYSEA_CORE_FIELD_NAMES.has(key) || !allowedSpecificFields.has(key)) {
      throw new Error(`Unsupported BabySea field: ${key}`);
    }

    params[key] = coerceBabySeaSpecificValue(value);
  }

  return params;
}

export function mergeGenerationMetadata(...values: Array<unknown>): Json {
  const metadata: Record<string, unknown> = {};

  for (const value of values) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(metadata, value);
    }
  }

  return metadata as Json;
}

function validateBflDimensions(
  values: { bfl_width?: number; bfl_height?: number },
  context: z.RefinementCtx,
) {
  const hasWidth = values.bfl_width !== undefined;
  const hasHeight = values.bfl_height !== undefined;

  if (hasWidth !== hasHeight) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'BFL width and height must be set together.',
      path: hasWidth ? ['bfl_height'] : ['bfl_width'],
    });
  }
}

function optionalBflDimension() {
  return z.preprocess(
    emptyStringToUndefined,
    z.coerce
      .number()
      .int()
      .min(Math.min(BFL_DIMENSION_MIN, BFL_FLUX_2_DIMENSION_MIN))
      .optional(),
  );
}

function optionalTrimmedString() {
  return z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1).optional(),
  );
}

function emptyStringToUndefined(value: unknown) {
  return value === '' || value === null ? undefined : value;
}

function parseInputFiles(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function coerceBabySeaSpecificValue(value: string) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  return value;
}

function toMetadataRecord(metadata: Json | null) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return null;
  }

  return metadata as Record<string, unknown>;
}

function toJsonParsedJob(value: unknown) {
  return QueuedGenerationJobSchema.parse(JSON.parse(JSON.stringify(value)));
}
