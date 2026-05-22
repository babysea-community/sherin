import { describe, expect, it } from 'vitest';

import {
  isBflApiHost,
  normalizeBflApiBaseUrl,
  validateBflPollingUrl,
} from '@/lib/inference/bfl/server-actions';

describe('BFL URL handling', () => {
  it('accepts BFL API shard hosts for returned polling URLs', () => {
    expect(
      validateBflPollingUrl(
        'https://api.eu1.bfl.ai/v1/get_result?id=request-123#ignored',
      ),
    ).toBe('https://api.eu1.bfl.ai/v1/get_result?id=request-123');
  });

  it('rejects non-API BFL delivery hosts for polling URLs', () => {
    expect(isBflApiHost('delivery-eu.bfl.ai')).toBe(false);
    expect(() =>
      validateBflPollingUrl('https://delivery-eu.bfl.ai/result.png'),
    ).toThrow('BFL polling_url must be a BFL API host.');
  });

  it('normalizes BFL API base URLs with an optional v1 path', () => {
    expect(normalizeBflApiBaseUrl('https://api.us.bfl.ai/v1')).toBe(
      'https://api.us.bfl.ai',
    );
  });
});
