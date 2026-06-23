import { defineConfig } from 'astro/config';

// zh is the default locale and serves from the root (/). English serves from /en.
// `site`/`base` are overridden per-deploy-target via env vars (GitHub Pages needs the
// full project URL + base path); defaults are fine for Vercel/Netlify root deploys.
export default defineConfig({
  site: process.env.SITE_URL || 'https://mox.app',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
