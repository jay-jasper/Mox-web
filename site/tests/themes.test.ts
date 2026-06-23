import { describe, it, expect } from 'vitest';
import { getThemes, getTheme, EFFECT_TYPES } from '../src/data/themes';

describe('themes data', () => {
  it('loads all 20 themes', () => {
    expect(getThemes().length).toBe(20);
  });
  it('looks up a theme by id', () => {
    expect(getTheme('liuguang')?.name.zh).toBe('流光');
  });
  it('every theme uses a known effect type', () => {
    for (const th of getThemes()) {
      expect(EFFECT_TYPES).toContain(th.effect);
    }
  });
  it('every theme has 3 palette colors and >=1 effect color', () => {
    for (const th of getThemes()) {
      expect(th.palette.bg && th.palette.text && th.palette.accent).toBeTruthy();
      expect(th.effectColors.length).toBeGreaterThanOrEqual(1);
    }
  });
  it('has unique ids', () => {
    const ids = getThemes().map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
