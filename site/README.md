# Mox Site

Marketing landing page + docs station for Mox. Built with Astro (static), bilingual (zh default, `/en`).

## Develop

```sh
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # static output → dist/
npm test         # vitest unit tests
```

## Deploy

- **GitHub Pages:** `../.github/workflows/deploy-pages.yml` (sets `SITE_URL`/`BASE_PATH` from the Pages action).
- **Vercel:** import the repo, set root directory to `site/` (`vercel.json` present).
- **Netlify:** `netlify.toml` sets `base`/`publish`.

## Structure

- `src/pages/` — routes (zh at `/`, en under `/en/`)
- `src/components/`, `src/layouts/` — UI
- `src/i18n/` — bilingual strings (`t(locale, key)`)
- `src/data/` — theme metadata (`themes.json` + typed loader, source of truth for the effects engine + gallery)
