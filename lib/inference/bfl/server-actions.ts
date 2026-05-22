import 'server-only';
import {
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
// BFL signed sample URLs are valid for ~10 minutes. We download to durable
// storage immediately, but the URL is also persisted to metadata so the UI
// can surface a stale-link warning when the asset cannot be resolved.
const BFL_SAMPLE_URL_TTL_MS = 10 * 60 * 1000;

export function isBflConfigured() {
  return Boolean(getOptionalEnv('BFL_API_KEY'));
}

export function createBflProvider(): InferenceProvider {
  const apiKey = requireEnv('BFL_API_KEY');
  const baseUrl = resolveBflBaseUrl();

  return {
    id: 'bfl',
    label: 'BFL',
    async generate(
      request: InferenceRequest,
      options,
    ): Promise<InferenceResult> {
      const modelConfig = resolveBflModelConfig(request.model);
      const modelEndpoint = modelConfig.endpoint;
      const dimensions = resolveBflDimensions(request, modelConfig);
      const width = request.bflWidth ?? dimensions?.width;
      const height = request.bflHeight ?? dimensions?.height;

      if (modelConfig.sizingMode === 'dimensions' && (!width || !height)) {
        throw new Error(`Unsupported ratio for BFL: ${request.ratio}`);
      }

      assertBflRequestMatchesModelConfig(request, modelConfig);

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
        sherin_stage: 'bfl_submitting',
        bfl_model_endpoint: modelEndpoint,
        ...(resumeIsLikelyDuplicate ? { bfl_duplicate_risk: true } : {}),
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
            ...createBflRequestBody(request, width, height, modelConfig),
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
) {
  const body: Record<string, unknown> = {
    prompt: request.prompt,
    safety_tolerance: request.bflSafetyTolerance,
    output_format: request.outputFormat,
  };

  if (config.sizingMode === 'dimensions') {
    body.width = width;
    body.height = height;
  } else {
    body.aspect_ratio = request.ratio;
  }

  if (request.bflSeed !== undefined) {
    body.seed = request.bflSeed;
  }

  if (request.bflImagePrompt) {
    body.image_prompt = request.bflImagePrompt;
  }

  if (config.supportsPromptUpsampling) {
    body.prompt_upsampling = request.bflPromptUpsampling;
  }

  if (config.supportsGuidance && request.bflGuidanceScale !== undefined) {
    body.guidance = request.bflGuidanceScale;
  }

  if (config.supportsSteps && request.bflNumInferenceSteps !== undefined) {
    body.steps = request.bflNumInferenceSteps;
  }

  if (config.supportsRaw) {
    body.raw = request.bflRaw;
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
) {
  if (!includesString(config.outputFormats, request.outputFormat)) {
    throw new Error(
      `BFL model ${request.model} does not support output format ${request.outputFormat}.`,
    );
  }

  if (!includesNumber(config.safetyTolerances, request.bflSafetyTolerance)) {
    throw new Error(
      `BFL model ${request.model} does not support safety tolerance ${request.bflSafetyTolerance}.`,
    );
  }

  if (!includesString(config.ratios, request.ratio)) {
    throw new Error(
      `BFL model ${request.model} does not support ${request.ratio}.`,
    );
  }

  if (
    config.sizingMode === 'aspectRatio' &&
    (request.bflWidth !== undefined || request.bflHeight !== undefined)
  ) {
    throw new Error(
      `BFL model ${request.model} does not support custom dimensions.`,
    );
  }

  if (request.inputFiles.length > config.inputFileLimit) {
    throw new Error(
      `BFL model ${request.model} supports at most ${config.inputFileLimit} input image URLs.`,
    );
  }

  if (request.inputFiles.length > 0 && config.inputFileLimit === 0) {
    throw new Error(`BFL model ${request.model} does not support input files.`);
  }

  if (request.bflImagePrompt && !config.supportsImagePrompt) {
    throw new Error(
      `BFL model ${request.model} does not support image prompts.`,
    );
  }

  if (request.bflPromptUpsampling && !config.supportsPromptUpsampling) {
    throw new Error(
      `BFL model ${request.model} does not support prompt upsampling.`,
    );
  }

  if (request.bflGuidanceScale !== undefined && !config.supportsGuidance) {
    throw new Error(`BFL model ${request.model} does not support guidance.`);
  }

  if (request.bflNumInferenceSteps !== undefined && !config.supportsSteps) {
    throw new Error(`BFL model ${request.model} does not support steps.`);
  }

  if (request.bflRaw && !config.supportsRaw) {
    throw new Error(`BFL model ${request.model} does not support raw mode.`);
  }
}

function includesString(values: readonly string[], value: string) {
  return values.includes(value);
}

function includesNumber(values: readonly number[], value: number) {
  return values.includes(value);
}

function createBflMetadata({
  height,
  modelEndpoint,
  pollingUrl,
  request,
  requestId,
  resumed,
  width,
  duplicateRisk = false,
}: {
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
    bfl_has_image_prompt: Boolean(request.bflImagePrompt),
    bfl_input_file_count: request.inputFiles.length,
    bfl_prompt_upsampling: request.bflPromptUpsampling,
    bfl_guidance_scale: request.bflGuidanceScale ?? null,
    bfl_num_inference_steps: request.bflNumInferenceSteps ?? null,
    bfl_raw: request.bflRaw,
    bfl_seed: request.bflSeed ?? null,
    bfl_safety_tolerance: request.bflSafetyTolerance,
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

  if (metadata.bfl_duplicate_risk === true) {
    return true;
  }

  const stage = metadata.sherin_stage;
  const hasRequestId =
    typeof metadata.bfl_request_id === 'string' &&
    (metadata.bfl_request_id as string).length > 0;

  return stage === 'bfl_submitting' && !hasRequestId;
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
