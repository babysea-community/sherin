import { DEFAULT_MODEL_ID } from '@/lib/app-config';

export const SHERIN_SAMPLE_RESULT = {
  createdAt: '2026-05-17T09:30:00.000Z',
  generationId: 'sherin-demo-generation-0001',
  id: 'sherin-demo-result',
  model: DEFAULT_MODEL_ID,
  outputFormat: 'png',
  previewUrl:
    'https://imagedelivery.net/ub24fjUytZQ3JbssUo49_w/21007a46-0899-4655-d26a-1b77d2f7a300/1024x1024',
  prompt:
    'A color film-inspired portrait of a young Japanese woman looking to the camera with a shallow depth of field that blurs the surrounding elements, drawing attention to her eyes. The fine grain and cast suggest a high ISO film stock, while the wide aperture lens creates a motion blur effect, enhancing the natural documentary style',
  ratio: '1:1',
  status: 'succeeded',
} as const;
