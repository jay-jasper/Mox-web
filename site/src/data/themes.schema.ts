/** One of the 11 ambient effect renderers (see spec §6). */
export type EffectType =
  | 'stars' | 'aurora' | 'orbs' | 'motes' | 'petals' | 'maple'
  | 'bamboo' | 'snow' | 'fireflies' | 'bubbles' | 'rain';

export interface ThemeMeta {
  /** stable id, e.g. "liuguang" */
  id: string;
  /** display names */
  name: { zh: string; en: string };
  /** true if this is a dark theme */
  dark: boolean;
  /** key palette colors as hex */
  palette: { bg: string; text: string; accent: string };
  /** which ambient effect this theme plays */
  effect: EffectType;
  /** hex colors fed to the effect renderer */
  effectColors: string[];
}
