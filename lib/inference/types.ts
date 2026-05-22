import type { SherinModelId } from '@/lib/app-config';

export type InferenceProviderId = 'bfl' | 'babysea';

export type InferenceRequest = {
  model: SherinModelId;
  prompt: string;
  ratio: string;
  resolution?: string;
  outputFormat: string;
  outputNumber: number;
  providerOrder: string;
  inputFiles: string[];
  babyseaSpecificParams: Record<string, string | number | boolean>;
  bflGuidanceScale?: number;
  bflImagePrompt?: string;
  bflNumInferenceSteps?: number;
  bflWidth?: number;
  bflHeight?: number;
  bflPromptUpsampling: boolean;
  bflRaw: boolean;
  bflSeed?: number;
  bflSafetyTolerance: number;
};

export type InferenceResult = {
  providerId: InferenceProviderId;
  remoteUrl: string;
  contentType: string;
  metadata: Record<string, unknown>;
};

export type InferenceGenerateOptions = {
  idempotencyKey?: string;
  /** Server-owned provider generation id used to resume polling without resubmitting. */
  providerGenerationId?: string;
  /**
   * Called immediately before the provider performs its non-idempotent submit
   * call. Used by the worker to persist a "submitting" marker so that a crash
   * between submit and id-persistence can be detected on the next worker tick.
   * Providers that are fully idempotent (e.g. BabySea via idempotencyKey) MAY
   * skip calling this; for providers without server-side idempotency (e.g.
   * BFL) this MUST be awaited prior to the submit network call.
   */
  onPreSubmit?: (metadata: Record<string, unknown>) => Promise<void> | void;
  onStarted?: (metadata: Record<string, unknown>) => Promise<void> | void;
  resumeMetadata?: Record<string, unknown> | null;
};

export interface InferenceProvider {
  readonly id: InferenceProviderId;
  readonly label: string;
  generate(
    request: InferenceRequest,
    options?: InferenceGenerateOptions,
  ): Promise<InferenceResult>;
}
