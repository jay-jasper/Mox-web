import { describe, it, expect } from 'vitest';
import { hexA } from '../src/effects/ambient';

describe('hexA', () => {
  it('expands #rrggbb with alpha', () => {
    expect(hexA('#5b8cff', 0.5)).toBe('rgba(91,140,255,0.5)');
  });
  it('expands 3-digit hex', () => {
    expect(hexA('#fff', 1)).toBe('rgba(255,255,255,1)');
  });
  it('clamps alpha to [0,1]', () => {
    expect(hexA('#000000', 2)).toBe('rgba(0,0,0,1)');
    expect(hexA('#000000', -1)).toBe('rgba(0,0,0,0)');
  });
});
