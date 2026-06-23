// Global theme controller: re-skins the whole site (CSS vars) and drives the
// site-wide ambient effect when a theme is chosen from the panel. Choice persists.
import { getThemes, getTheme } from '@/data/themes';
import { AmbientEffect } from '@/effects/ambient';

const KEY = 'mox.theme';
let fx: AmbientEffect | null = null;

// Theme ids were renamed mid-project to match the app; migrate old saved ids so a
// previously-chosen theme still resolves (otherwise it silently fell back to the default).
const ALIAS: Record<string, string> = {
  dongwudao: 'island', yinghuadao: 'island-sakura', xuedao: 'island-snow',
  liuguang: 'liquidglass', zihai: 'prism', jiqing: 'shuimo', japandi: 'rixi',
  dai: 'studio', ziye: 'midnight', degula: 'dracula', luohuo: 'onedark',
  shuangye: 'chuxue', feiye: 'waifu', danfeng: 'redmaple', mo: 'ink', zhu: 'bamboo',
};
function resolveId(id: string | null): string | null {
  if (!id) return null;
  return ALIAS[id] || id;
}

export function applyTheme(id: string) {
  const th = getTheme(id);
  if (!th) return;
  const r = document.documentElement.style;
  r.setProperty('--bg', th.palette.bg);
  r.setProperty('--fg', th.palette.text);
  r.setProperty('--accent', th.palette.accent);
  document.documentElement.style.colorScheme = th.dark ? 'dark' : 'light';
  fx?.setConfig({ type: th.effect, colors: th.effectColors });
  fx?.start();
  try {
    localStorage.setItem(KEY, id);
    // Persisted for the inline head script to restore the palette pre-paint (no FOUC).
    localStorage.setItem('mox.theme.css', JSON.stringify({
      bg: th.palette.bg, fg: th.palette.text, accent: th.palette.accent, dark: th.dark,
    }));
  } catch {}
  document.querySelectorAll<HTMLElement>('[data-theme-id]').forEach((el) =>
    el.classList.toggle('on', el.dataset.themeId === id));
}

export function initTheme() {
  const canvas = document.getElementById('site-fx') as HTMLCanvasElement | null;
  let saved: string | null = null;
  try { saved = localStorage.getItem(KEY); } catch {}
  saved = resolveId(saved); // migrate any old/renamed id
  // Default theme is 绯夜 (waifu) unless the user picked one before.
  const th = (saved ? getTheme(saved) : undefined) || getTheme('waifu');

  if (canvas) {
    fx = new AmbientEffect(canvas, {
      type: th?.effect || 'orbs',
      colors: th?.effectColors || ['#ff5c8a', '#c04fff', '#7b5cff'],
    });
    fx.start();
  }
  if (th) applyTheme(th.id);

  // Centered modal open/close.
  const panel = document.getElementById('theme-panel');
  const openBtn = document.getElementById('theme-open');
  openBtn?.addEventListener('click', (e) => { e.preventDefault(); panel?.classList.toggle('open'); });
  panel?.addEventListener('click', (e) => { if (e.target === panel) panel.classList.remove('open'); }); // click dim backdrop
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') panel?.classList.remove('open'); });

  // Swatch clicks.
  document.querySelectorAll<HTMLElement>('[data-theme-id]').forEach((el) =>
    el.addEventListener('click', () => { applyTheme(el.dataset.themeId!); }));
}
