# Mox Web

> **Write beautifully, think clearly.**
> Native macOS · WYSIWYG Markdown · 20 themes with live effects.

Marketing site and bilingual (zh / en) documentation for **[Mox](https://mox.app)** —
a native macOS WYSIWYG Markdown editor.

🌐 **Live:** https://jay-jasper.github.io/Mox-web/

Mox renders Markdown inline as you type — no split-pane preview, no mode switching.
Built in Swift on TextKit 2, it stays fast on huge documents while handling math,
diagrams, tables, callouts, and AI ghost-completion as first-class citizens.

- ⚡ **Instant rendering** — Typora-style inline folding, native-fast
- 🎨 **20 themes** with live ambient effects
- 🧮 **Math · diagrams · tables** built in, no plugins
- 🤖 **AI ghost completion** — write with the grain
- 🔒 **Local-first** — your notes stay on your Mac
- 🌏 **Bilingual** — full zh / en interface and docs

This repo is managed as a git submodule of the main Mox repo, mounted at `website/`.

## Stack

- **[Astro](https://astro.build)** — static output, zero JS by default
- **TypeScript** + a small effects engine (`site/src/effects/`)
- **Bilingual i18n** — `zh` at `/`, `en` at `/en/` (see `site/src/i18n/`)
- **Vitest** — unit tests for i18n, themes, and effects

## Structure

```
.
├── docs/        # product & developer documentation (markdown)
└── site/        # Astro marketing + docs station
    ├── src/pages/        # routes (zh at /, en under /en/)
    ├── src/components/    # UI (Hero, Features, ThemePanel, …)
    ├── src/layouts/       # Base layout
    ├── src/i18n/          # bilingual strings — t(locale, key)
    ├── src/data/          # theme metadata (source of truth for gallery + effects)
    └── public/docs/       # rendered docs served by the docs station (en/ + zh/)
```

## Develop

```sh
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # static output → dist/
npm test         # vitest
```

## Deploy

The same static build serves three targets:

- **GitHub Pages** — `.github/workflows/deploy-pages.yml` (injects `SITE_URL` / `BASE_PATH`)
- **Vercel** — import the repo, root directory `site/` (`site/vercel.json`)
- **Netlify** — `site/netlify.toml` sets `base` / `publish`

`astro.config.mjs` defaults to `https://mox.app`; deploy targets override `site` / `base` via env vars.

## Working on it as a submodule

It's a normal git repo inside `website/`. Commit and push from there:

```sh
cd website
# …edit…
git add -A && git commit -m "docs: …"
git push
```

Then record the new submodule revision in the parent Mox repo:

```sh
cd ..
git add website && git commit -m "chore: bump website submodule"
```
