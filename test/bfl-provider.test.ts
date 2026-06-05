import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createBflProvider } from '@/lib/inference/bfl/server-actions';
import type { InferenceRequest } from '@/lib/inference/types';

describe('BFL provider', () => {
  beforeEach(() => {
    process.env.BFL_API_KEY = 'bfl_test_key';
    delete process.env.BFL_API_BASE_URL;
    delete process.env.INFERENCE_POLL_TIMEOUT_MS;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('submits FLUX 1.1 Pro Ultra with aspect ratio and raw mode', async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn();

    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 'req_ultra',
            polling_url: 'https://api.bfl.ai/v1/get_result?id=req_ultra',
          }),
          { headers: { 'content-type': 'application/json' }, status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            result: { sample: 'https://assets.example.com/ultra.png' },
            status: 'Ready',
          }),
          { headers: { 'content-type': 'application/json' }, status: 200 },
        ),
      );

    vi.stubGlobal('fetch', fetchMock);

    const generationPromise = createBflProvider().generate(
      createRequest({
        bflRaw: true,
        model: 'bfl/flux-1.1-pro-ultra',
        outputFormat: 'png',
        ratio: '21:9',
      }),
    );

    await vi.advanceTimersByTimeAsync(1_500);

    const result = await generationPromise;
    const [submitUrl, submitInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    const submitBody = JSON.parse(String(submitInit.body)) as Record<
      string,
      unknown
    >;

    expect(submitUrl).toBe('https://api.bfl.ai/v1/flux-pro-1.1-ultra');
    expect(submitBody).toMatchObject({
      aspect_ratio: '21:9',
      output_format: 'png',
      prompt: 'A clean regression image',
      prompt_upsampling: false,
      raw: true,
      safety_tolerance: 2,
    });
    expect(submitBody).not.toHaveProperty('width');
    expect(submitBody).not.toHaveProperty('height');
    expect(submitBody).not.toHaveProperty('image_prompt');
    expect(result.remoteUrl).toBe('https://assets.example.com/ultra.png');
  });

  it('rejects image prompts unsupported by current FLUX 1.1 endpoints', async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      createBflProvider().generate(
        createRequest({
          bflImagePrompt: 'base64-image',
          model: 'bfl/flux-1.1-pro',
        }),
      ),
    ).rejects.toThrow('does not support image prompts');

    await expect(
      createBflProvider().generate(
        createRequest({
          bflImagePrompt: 'base64-image',
          model: 'bfl/flux-1.1-pro-ultra',
          ratio: '16:9',
        }),
      ),
    ).rejects.toThrow('does not support image prompts');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects input files above the selected BFL model limit', async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      createBflProvider().generate(
        createRequest({
          inputFiles: Array.from(
            { length: 9 },
            (_unusedValue, index) =>
              `https://assets.example.com/input-${index}.png`,
          ),
          model: 'bfl/flux-2-pro',
        }),
      ),
    ).rejects.toThrow('supports at most 8 input image URLs');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects safety tolerances unsupported by the selected BFL model', async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      createBflProvider().generate(
        createRequest({
          bflSafetyTolerance: 6,
          model: 'bfl/flux-2-pro',
        }),
      ),
    ).rejects.toThrow('does not support safety tolerance 6');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects output formats unsupported by direct BFL', async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      createBflProvider().generate(
        createRequest({
          outputFormat: 'jpg',
        }),
      ),
    ).rejects.toThrow('does not support output format jpg');

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function createRequest(
  overrides: Partial<InferenceRequest> = {},
): InferenceRequest {
  return {
    babyseaSpecificParams: {},
    bflPromptUpsampling: false,
    bflRaw: false,
    bflSafetyTolerance: 2,
    inputFiles: [],
    model: 'bfl/flux-1.1-pro',
    outputFormat: 'jpeg',
    outputNumber: 1,
    prompt: 'A clean regression image',
    providerOrder: 'fastest',
    ratio: '1:1',
    ...overrides,
  };
}
