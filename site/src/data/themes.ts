import raw from './themes.json';
import type { ThemeMeta, EffectType } from './themes.schema';

export const EFFECT_TYPES: EffectType[] = [
  'stars', 'aurora', 'orbs', 'motes', 'petals', 'maple',
  'bamboo', 'snow', 'fireflies', 'bubbles', 'rain',
];

const THEMES = raw as ThemeMeta[];

export function getThemes(): ThemeMeta[] {
  return THEMES;
}

export function getTheme(id: string): ThemeMeta | undefined {
  return THEMES.find((t) => t.id === id);
}

export type { ThemeMeta, EffectType };
