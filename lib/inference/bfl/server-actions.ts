import 'server-only';
import { Buffer } from 'node:buffer';
import {
  DEFAULT_BFL_SAFETY_TOLERANCE,
  getBflFlux2Size,
  isBflFlux2Model,
  RATIOS,
  type SherinDimensionRatio,
} from '@/lib/app-config';
import {
  getOptionalEnv,
  getOptionalPositiveIntEnv,
  requireEnv,
} from '@/lib/utils/env';
import { resolveBflModelConfig } from './models';
import type {
  InferenceProvider,
  InferenceRequest,
  InferenceResult,
} from '../types';

const DEFAULT_BFL_BASE_URL = 'https://api.bfl.ai';
const MAX_BFL_IMAGE_PROMPT_BYTES = 10 * 1024 * 1024;
const MAX_BFL_IMAGE_PROMPT_BASE64_CHARS =
  Math.ceil(MAX_BFL_IMAGE_PROMPT_BYTES / 3) * 4;

const POLL_INTERVAL_MS = 1500;
// Polling budget per worker invocation. Must stay safely below the route's
// `maxDuration` (60s by default on Vercel Pro). When the budget elapses the
// worker exits cleanly; the next cron tick resumes polling via the persisted
// `bfl_request_id`, so end-to-end generation latency is uncapped. Override
// with `INFERENCE_POLL_TIMEOUT_MS` if you raise the worker `maxDuration`.
const DEFAULT_POLL_TIMEOUT_MS = 45_000;
const POLL_TIMEOUT_MS =
  getOptionalPositiveIntEnv('INFERENCE_POLL_TIMEOUT_MS') ??
  DEFAULT_POLL_TIMEOUT_MS;
const REQUEST_TIMEOUT_MS = 20_000;
// Inference signed sample URLs are valid for ~10 minutes. We download to durable
// storage immediately, but the URL is also persisted to metadata so the UI
// can surface a stale-link warning when the asset cannot be resolved.
const BFL_SAMPLE_URL_TTL_MS = 10 * 60 * 1000;

export function isBflConfigured() {
  return Boolean(getOptionalEnv('BFL_API_KEY'));
}

type BflRequestParams = {
  guidanceScale?: number;
  height?: number;
  imagePrompt?: string;
  numInferenceSteps?: number;
  promptUpsampling: boolean;
  raw: boolean;
  safetyTolerance: number;
  seed?: number;
  width?: number;
};

function readBflParamsFromFormData(
  formData: FormData,
  config: ReturnType<typeof resolveBflModelConfig>,
): BflRequestParams {
  const rawImagePrompt = readOptionalString(
    formData.get('byok_image_prompt') ?? formData.get('bfl_image_prompt'),
  );
  const imagePrompt = rawImagePrompt
    ? normalizeBflImagePromptBase64(rawImagePrompt)
    : undefined;

  if (rawImagePrompt && !imagePrompt) {
    throw new Error('Invalid BFL image prompt.');
  }

  return {
    ...(readOptionalNumber(
      formData.get('byok_guidance_scale') ?? formData.get('bfl_guidance_scale'),
    ) !== undefined
      ? {
          guidanceScale: readOptionalNumber(
            formData.get('byok_guidance_scale') ??
              formData.get('bfl_guidance_scale'),
          ),
        }
      : {}),
    ...(readOptionalNumber(
      formData.get('byok_height') ?? formData.get('bfl_height'),
    ) !== undefined
      ? {
          height: readOptionalNumber(
            formData.get('byok_height') ?? formData.get('bfl_height'),
          ),
        }
      : {}),
    ...(imagePrompt ? { imagePrompt } : {}),
    ...(readOptionalNumber(
      formData.get('byok_num_inference_steps') ??
        formData.get('bfl_num_inference_steps'),
    ) !== undefined
      ? {
          numInferenceSteps: readOptionalNumber(
            formData.get('byok_num_inference_steps') ??
              formData.get('bfl_num_inference_steps'),
          ),
        }
      : {}),
    promptUpsampling: formData.has('byok_prompt_upsampling')
      ? formData.get('byok_prompt_upsampling') === 'true'
      : formData.has('bfl_prompt_upsampling')
        ? formData.get('bfl_prompt_upsampling') === 'true'
        : config.defaultPromptUpsampling,
    raw: (formData.get('byok_raw') ?? formData.get('bfl_raw')) === 'true',
    safetyTolerance:
      readOptionalNumber(
        formData.get('byok_safety_tolerance') ??
          formData.get('bfl_safety_tolerance'),
      ) ?? DEFAULT_BFL_SAFETY_TOLERANCE,
    ...(readOptionalNumber(
      formData.get('byok_seed') ?? formData.get('bfl_seed'),
    ) !== undefined
      ? {
          seed: readOptionalNumber(
            formData.get('byok_seed') ?? formData.get('bfl_seed'),
          ),
        }
      : {}),
    ...(readOptionalNumber(
      formData.get('byok_width') ?? formData.get('bfl_width'),
    ) !== undefined
      ? {
          width: readOptionalNumber(
            formData.get('byok_width') ?? formData.get('bfl_width'),
          ),
        }
      : {}),
  };
}

function resolveBflParams(
  params: InferenceRequest['byokParams'],
  config: ReturnType<typeof resolveBflModelConfig>,
): BflRequestParams {
  return {
    ...(readOptionalNumber(params.guidanceScale) !== undefined
      ? { guidanceScale: readOptionalNumber(params.guidanceScale) }
      : {}),
    ...(readOptionalNumber(params.height) !== undefined
      ? { height: readOptionalNumber(params.height) }
      : {}),
    ...(readOptionalString(params.imagePrompt)
      ? { imagePrompt: readOptionalString(params.imagePrompt) }
      : {}),
    ...(readOptionalNumber(params.numInferenceSteps) !== undefined
      ? { numInferenceSteps: readOptionalNumber(params.numInferenceSteps) }
      : {}),
    promptUpsampling:
      readOptionalBoolean(params.promptUpsampling) ??
      config.defaultPromptUpsampling,
    raw: readOptionalBoolean(params.raw) ?? false,
    safetyTolerance:
      readOptionalNumber(params.safetyTolerance) ??
      DEFAULT_BFL_SAFETY_TOLERANCE,
    ...(readOptionalNumber(params.seed) !== undefined
      ? { seed: readOptionalNumber(params.seed) }
      : {}),
    ...(readOptionalNumber(params.width) !== undefined
      ? { width: readOptionalNumber(params.width) }
      : {}),
  };
}

function toBflByokParams(params: BflRequestParams) {
  return {
    ...(params.guidanceScale !== undefined
      ? { guidanceScale: params.guidanceScale }
      : {}),
    ...(params.height !== undefined ? { height: params.height } : {}),
    ...(params.imagePrompt ? { imagePrompt: params.imagePrompt } : {}),
    ...(params.numInferenceSteps !== undefined
      ? { numInferenceSteps: params.numInferenceSteps }
      : {}),
    promptUpsampling: params.promptUpsampling,
    raw: params.raw,
    safetyTolerance: params.safetyTolerance,
    ...(params.seed !== undefined ? { seed: params.seed } : {}),
    ...(params.width !== undefined ? { width: params.width } : {}),
  };
}

function readOptionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function readOptionalBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}

export function createBflProvider(): InferenceProvider {
  const apiKey = requireEnv('BFL_API_KEY');
  const baseUrl = resolveBflBaseUrl();

  return {
    id: 'bfl',
    label: 'BFL',
    submitPolicy: { maxSubmitAttemptsWithoutProviderId: 2 },
    extractProviderGenerationId(metadata) {
      const value = metadata.bfl_request_id;

      return typeof value === 'string' && value.length > 0 ? value : null;
    },
    prepareRequest({ formData, request }) {
      const modelConfig = resolveBflModelConfig(request.model);
      const params = readBflParamsFromFormData(formData, modelConfig);
      const preparedRequest = {
        ...request,
        byokParams: toBflByokParams(params),
        resolution: request.resolution ?? modelConfig.defaultResolution,
      };

      assertBflRequestMatchesModelConfig(preparedRequest, modelConfig, params);

      return {
        inputFileLimit: modelConfig.inputFileLimit,
        request: preparedRequest,
      };
    },
    async generate(
      request: InferenceRequest,
      options,
    ): Promise<InferenceResult> {
      const modelConfig = resolveBflModelConfig(request.model);
      const params = resolveBflParams(request.byokParams, modelConfig);
      const modelEndpoint = modelConfig.endpoint;
      const dimensions = resolveBflDimensions(request, modelConfig);
      const width = params.width ?? dimensions?.width;
      const height = params.height ?? dimensions?.height;

      if (modelConfig.sizingMode === 'dimensions' && (!width || !height)) {
        throw new Error(`Unsupported ratio for BFL: ${request.ratio}`);
      }

      assertBflRequestMatchesModelConfig(request, modelConfig, params);

      const resumeRequestId = options?.providerGenerationId ?? null;
      const resumeIsLikelyDuplicate = isResumeLikelyDuplicate(
        options?.resumeMetadata,
      );

      if (resumeRequestId) {
        const pollingUrl = resolveBflResumePollingUrl(
          baseUrl,
          resumeRequestId,
          options?.resumeMetadata,
        );
        const bflMetadata = createBflMetadata({
          params,
          height,
          modelEndpoint,
          pollingUrl,
          request,
          requestId: resumeRequestId,
          resumed: true,
          width,
        });

        await options?.onStarted?.(bflMetadata);

        const polled = await pollBfl(pollingUrl, apiKey);
        const sample = polled.result?.sample;

        if (typeof sample !== 'string' || !sample.startsWith('https://')) {
          throw new Error('BFL returned no signed sample URL.');
        }

        return {
          providerId: 'bfl',
          remoteUrl: sample,
          contentType: contentTypeForBflOutputFormat(request.outputFormat),
          metadata: {
            ...bflMetadata,
            bfl_remote_url: sample,
            bfl_remote_url_expires_at: new Date(
              Date.now() + BFL_SAMPLE_URL_TTL_MS,
            ).toISOString(),
            bfl_status: polled.status,
          },
        };
      }

      // CRITICAL: BFL does not support idempotent re-submit. The worker MUST
      // persist a "submitting" marker before this network call so that a
      // crash between submit and id-persistence is detectable. Without that
      // marker, a worker crash here would silently re-charge credits on retry.
      await options?.onPreSubmit?.({
        sherin_model_id: request.model,
        sherin_provider: 'bfl',
        sherin_stage: 'provider_submitting',
        bfl_model_endpoint: modelEndpoint,
        ...(resumeIsLikelyDuplicate
          ? { bfl_duplicate_risk: true, sherin_provider_duplicate_risk: true }
          : {}),
      });

      const submitResponse = await fetch(
        `${baseUrl}/v1/${encodeURIComponent(modelEndpoint)}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-key': apiKey,
          },
          body: JSON.stringify({
            ...createBflRequestBody(
              request,
              width,
              height,
              modelConfig,
              params,
            ),
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      );

      if (!submitResponse.ok) {
        throw await buildBflHttpError('BFL request', submitResponse);
      }

      const submitJson = (await submitResponse.json()) as {
        id?: string;
        polling_url?: string;
      };

      if (!submitJson.id) {
        throw new Error('BFL response did not include an id.');
      }

      const pollingUrl = validateBflPollingUrl(submitJson.polling_url);

      if (!pollingUrl) {
        throw new Error('BFL response did not include a polling_url.');
      }

      const bflMetadata = createBflMetadata({
        params,
        height,
        modelEndpoint,
        pollingUrl,
        request,
        requestId: submitJson.id,
        resumed: false,
        width,
        duplicateRisk: resumeIsLikelyDuplicate,
      });

      await options?.onStarted?.(bflMetadata);

      const polled = await pollBfl(pollingUrl, apiKey);
      const sample = polled.result?.sample;

      if (typeof sample !== 'string' || !sample.startsWith('https://')) {
        throw new Error('BFL returned no signed sample URL.');
      }

      return {
        providerId: 'bfl',
        remoteUrl: sample,
        contentType: contentTypeForBflOutputFormat(request.outputFormat),
        metadata: {
          ...bflMetadata,
          bfl_remote_url: sample,
          bfl_remote_url_expires_at: new Date(
            Date.now() + BFL_SAMPLE_URL_TTL_MS,
          ).toISOString(),
          bfl_status: polled.status,
        },
      };
    },
  };
}

function resolveBflDimensions(
  request: InferenceRequest,
  config: ReturnType<typeof resolveBflModelConfig>,
) {
  if (config.sizingMode === 'aspectRatio') {
    return undefined;
  }

  if (isBflFlux2Model(request.model)) {
    return getBflFlux2Size(request.ratio, request.resolution);
  }

  return RATIOS[request.ratio as SherinDimensionRatio];
}

function createBflRequestBody(
  request: InferenceRequest,
  width: number | undefined,
  height: number | undefined,
  config: ReturnType<typeof resolveBflModelConfig>,
  params: BflRequestParams,
) {
  const body: Record<string, unknown> = {
    prompt: request.prompt,
    safety_tolerance: params.safetyTolerance,
    output_format: request.outputFormat,
  };

  if (config.sizingMode === 'dimensions') {
    body.width = width;
    body.height = height;
  } else {
    body.aspect_ratio = request.ratio;
  }

  if (params.seed !== undefined) {
    body.seed = params.seed;
  }

  if (params.imagePrompt) {
    body.image_prompt = params.imagePrompt;
  }

  if (config.supportsPromptUpsampling) {
    body.prompt_upsampling = params.promptUpsampling;
  }

  if (config.supportsGuidance && params.guidanceScale !== undefined) {
    body.guidance = params.guidanceScale;
  }

  if (config.supportsSteps && params.numInferenceSteps !== undefined) {
    body.steps = params.numInferenceSteps;
  }

  if (config.supportsRaw) {
    body.raw = params.raw;
  }

  for (let index = 0; index < request.inputFiles.length; index += 1) {
    body[index === 0 ? 'input_image' : `input_image_${index + 1}`] =
      request.inputFiles[index];
  }

  return body;
}

function assertBflRequestMatchesModelConfig(
  request: InferenceRequest,
  config: ReturnType<typeof resolveBflModelConfig>,
  params: BflRequestParams,
) {
  if (!includesString(config.outputFormats, request.outputFormat)) {
    throw new Error(
      `BFL model ${request.model} does not support output format ${request.outputFormat}.`,
    );
  }

  if (!includesNumber(config.safetyTolerances, params.safetyTolerance)) {
    throw new Error(
      `BFL model ${request.model} does not support safety tolerance ${params.safetyTolerance}.`,
    );
  }

  if (!includesString(config.ratios, request.ratio)) {
    throw new Error(
      `BFL model ${request.model} does not support ${request.ratio}.`,
    );
  }

  if (
    config.sizingMode === 'aspectRatio' &&
    (params.width !== undefined || params.height !== undefined)
  ) {
    throw new Error(
      `BFL model ${request.model} does not support custom dimensions.`,
    );
  }

  if (params.width !== undefined || params.height !== undefined) {
    if (config.sizingMode !== 'dimensions') {
      throw new Error(
        `BFL model ${request.model} does not support custom dimensions.`,
      );
    }

    if (params.width === undefined || params.height === undefined) {
      throw new Error('BFL width and height must be set together.');
    }

    if (
      !isBflDimension(params.width, config.dimension) ||
      !isBflDimension(params.height, config.dimension)
    ) {
      throw new Error(
        `BFL model ${request.model} does not support custom dimensions ${params.width}x${params.height}.`,
      );
    }
  }

  if (request.inputFiles.length > config.inputFileLimit) {
    throw new Error(
      `BFL model ${request.model} supports at most ${config.inputFileLimit} input image URLs.`,
    );
  }

  if (request.inputFiles.length > 0 && config.inputFileLimit === 0) {
    throw new Error(`BFL model ${request.model} does not support input files.`);
  }

  if (params.imagePrompt && !config.supportsImagePrompt) {
    throw new Error(
      `BFL model ${request.model} does not support image prompts.`,
    );
  }

  if (params.promptUpsampling && !config.supportsPromptUpsampling) {
    throw new Error(
      `BFL model ${request.model} does not support prompt upsampling.`,
    );
  }

  if (params.guidanceScale !== undefined && !config.supportsGuidance) {
    throw new Error(`BFL model ${request.model} does not support guidance.`);
  }

  if (params.numInferenceSteps !== undefined && !config.supportsSteps) {
    throw new Error(`BFL model ${request.model} does not support steps.`);
  }

  if (params.raw && !config.supportsRaw) {
    throw new Error(`BFL model ${request.model} does not support raw mode.`);
  }
}

function isBflDimension(
  value: number,
  dimension: ReturnType<typeof resolveBflModelConfig>['dimension'],
) {
  const max = 'max' in dimension ? dimension.max : undefined;
  const step = 'step' in dimension ? dimension.step : undefined;

  return (
    Number.isInteger(value) &&
    value >= dimension.min &&
    (max === undefined || value <= max) &&
    (step === undefined || value % step === 0)
  );
}

function includesString(values: readonly string[], value: string) {
  return values.includes(value);
}

function includesNumber(values: readonly number[], value: number) {
  return values.includes(value);
}

function createBflMetadata({
  params,
  height,
  modelEndpoint,
  pollingUrl,
  request,
  requestId,
  resumed,
  width,
  duplicateRisk = false,
}: {
  params: BflRequestParams;
  height: number | undefined;
  modelEndpoint: string;
  pollingUrl: string;
  request: InferenceRequest;
  requestId: string;
  resumed: boolean;
  width: number | undefined;
  duplicateRisk?: boolean;
}) {
  return {
    sherin_model_id: request.model,
    sherin_stage: 'inference_started',
    bfl_request_id: requestId,
    bfl_model_endpoint: modelEndpoint,
    bfl_aspect_ratio: request.ratio,
    ...(width !== undefined ? { bfl_width: width } : {}),
    ...(height !== undefined ? { bfl_height: height } : {}),
    ...(request.resolution ? { bfl_resolution: request.resolution } : {}),
    bfl_has_image_prompt: Boolean(params.imagePrompt),
    bfl_input_file_count: request.inputFiles.length,
    bfl_prompt_upsampling: params.promptUpsampling,
    bfl_guidance_scale: params.guidanceScale ?? null,
    bfl_num_inference_steps: params.numInferenceSteps ?? null,
    bfl_raw: params.raw,
    bfl_seed: params.seed ?? null,
    bfl_safety_tolerance: params.safetyTolerance,
    bfl_output_format: request.outputFormat,
    bfl_polling_url: pollingUrlForMetadata(pollingUrl),
    ...(resumed ? { bfl_resumed: true } : {}),
    ...(duplicateRisk ? { bfl_duplicate_risk: true } : {}),
  };
}

type BflPollResponse = {
  status: string;
  result?: { sample?: string };
};

async function pollBfl(pollingUrl: string, apiKey: string) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let lastStatus = 'Pending';

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    const response = await fetch(pollingUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-key': apiKey,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw await buildBflHttpError('BFL polling', response);
    }

    const json = (await response.json()) as BflPollResponse;
    lastStatus = json.status;

    if (json.status === 'Ready') {
      return json;
    }

    if (json.status === 'Error' || json.status === 'Failed') {
      throw new Error(`BFL generation failed with status: ${json.status}`);
    }
  }

  throw buildBflPollTimeoutError(lastStatus);
}

function buildBflPollTimeoutError(lastStatus: string) {
  const error = new Error(
    `BFL generation timed out within this worker invocation (last status: ${lastStatus}).`,
  );
  error.name = 'TimeoutError';
  return error;
}

export function validateBflPollingUrl(value: string | undefined) {
  if (!value) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('BFL polling_url must be a valid URL.');
  }

  if (url.protocol !== 'https:') {
    throw new Error('BFL polling_url must use HTTPS.');
  }

  if (!isBflApiHost(url.hostname)) {
    throw new Error('BFL polling_url must be a BFL API host.');
  }

  url.hash = '';

  return url.toString();
}

function pollingUrlForMetadata(value: string) {
  const url = new URL(value);
  url.hash = '';

  return url.toString();
}

function resolveBflResumePollingUrl(
  baseUrl: string,
  requestId: string,
  metadata: Record<string, unknown> | null | undefined,
) {
  const storedPollingUrl = getResumeBflPollingUrl(metadata, requestId);

  return storedPollingUrl ?? buildBflPollingUrl(baseUrl, requestId);
}

function getResumeBflPollingUrl(
  metadata: Record<string, unknown> | null | undefined,
  requestId: string,
) {
  const value = metadata?.bfl_polling_url;

  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }

  try {
    const url = new URL(value);
    url.searchParams.set('id', requestId);

    return validateBflPollingUrl(url.toString());
  } catch {
    return null;
  }
}

function buildBflPollingUrl(baseUrl: string, requestId: string) {
  const url = new URL('/v1/get_result', `${baseUrl}/`);
  url.searchParams.set('id', requestId);

  const pollingUrl = validateBflPollingUrl(url.toString());

  if (!pollingUrl) {
    throw new Error('Could not build BFL polling URL.');
  }

  return pollingUrl;
}

function isResumeLikelyDuplicate(
  metadata: Record<string, unknown> | null | undefined,
) {
  if (!metadata) {
    return false;
  }

  if (
    metadata.bfl_duplicate_risk === true ||
    metadata.sherin_provider_duplicate_risk === true
  ) {
    return true;
  }

  const stage = metadata.sherin_stage;
  const hasRequestId =
    typeof metadata.bfl_request_id === 'string' &&
    (metadata.bfl_request_id as string).length > 0;

  return (
    (stage === 'bfl_submitting' || stage === 'provider_submitting') &&
    !hasRequestId
  );
}

function normalizeBflImagePromptBase64(value: string) {
  if (isHttpsUrl(value)) {
    return null;
  }

  const trimmed = value.trim();
  const dataUrlMatch =
    /^data:image\/(?:jpeg|jpg|png|gif|webp);base64,(.+)$/is.exec(trimmed);
  const unwrapped = dataUrlMatch?.[1] ?? trimmed;
  const compact = unwrapped.replace(/\s+/g, '');

  if (compact.length > MAX_BFL_IMAGE_PROMPT_BASE64_CHARS) {
    return null;
  }

  if (!compact || !/^[A-Za-z0-9+/]+={0,2}$/.test(compact)) {
    return null;
  }

  const remainder = compact.length % 4;

  if (remainder === 1) {
    return null;
  }

  const normalized =
    remainder === 0
      ? compact
      : compact.padEnd(compact.length + 4 - remainder, '=');

  const decoded = Buffer.from(normalized, 'base64');

  if (decoded.length === 0 || decoded.length > MAX_BFL_IMAGE_PROMPT_BYTES) {
    return null;
  }

  return normalized;
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Build an Error annotated with retry hints derived from the BFL response.
 * The worker inspects these properties to decide between transient retry
 * (429 / 5xx with Retry-After) and permanent failure (4xx other than 429).
 */
async function buildBflHttpError(label: string, response: Response) {
  const body = await safeText(response);
  const error = new Error(
    `${label} failed (${response.status}): ${body}`,
  ) as Error & {
    statusCode?: number;
    retryAfterSeconds?: number | null;
    isTransient?: boolean;
  };
  error.statusCode = response.status;
  error.retryAfterSeconds = parseRetryAfter(
    response.headers.get('retry-after'),
  );
  error.isTransient =
    response.status === 408 ||
    response.status === 425 ||
    response.status === 429 ||
    (response.status >= 500 && response.status < 600);
  return error;
}

function parseRetryAfter(value: string | null) {
  if (!value) {
    return null;
  }

  const seconds = Number(value);

  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(Math.ceil(seconds), 600);
  }

  const dateMs = Date.parse(value);

  if (Number.isFinite(dateMs)) {
    return Math.max(0, Math.min(600, Math.ceil((dateMs - Date.now()) / 1000)));
  }

  return null;
}

function contentTypeForBflOutputFormat(outputFormat: string) {
  if (outputFormat === 'png') return 'image/png';
  if (outputFormat === 'webp') return 'image/webp';
  return 'image/jpeg';
}

function resolveBflBaseUrl() {
  const configured = getOptionalEnv('BFL_API_BASE_URL');

  if (!configured) {
    return DEFAULT_BFL_BASE_URL;
  }

  return normalizeBflApiBaseUrl(configured, 'BFL_API_BASE_URL');
}

export function normalizeBflApiBaseUrl(
  value: string,
  envName = 'BFL_API_BASE_URL',
) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${envName} must be a valid URL.`);
  }

  if (url.protocol !== 'https:') {
    throw new Error(`${envName} must use HTTPS.`);
  }

  if (!isBflApiHost(url.hostname)) {
    throw new Error(`${envName} must be a BFL API host.`);
  }

  url.pathname = url.pathname.replace(/\/+$/, '');

  if (url.pathname === '/v1') {
    url.pathname = '';
  }

  if (url.pathname && url.pathname !== '/') {
    throw new Error(`${envName} can include only the optional /v1 path.`);
  }

  url.search = '';
  url.hash = '';

  return url.toString().replace(/\/+$/, '');
}

export function isBflApiHost(hostname: string) {
  const normalized = hostname.toLowerCase();

  return (
    normalized === 'api.bfl.ai' ||
    (normalized.startsWith('api.') && normalized.endsWith('.bfl.ai'))
  );
}

async function safeText(response: Response) {
  try {
    return (await response.text()).slice(0, 500);
  } catch {
    return '<no body>';
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
