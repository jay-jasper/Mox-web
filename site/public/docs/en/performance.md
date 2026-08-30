# Performance & Stress Test

Mox renders **natively** (no WebView) — diagrams are drawn straight into CoreGraphics by SwiftMermaid, math is rasterized by SwiftMath, and body text is laid out by TextKit 2. This page publishes a reproducible benchmark covering launch speed, parsing/rendering of very large documents, and memory.

## Test environment

- Apple Silicon · macOS · 36 GB RAM
- **Release** build (optimized)
- Stress document: a script-generated **100,000-line / 2.14 MB** Markdown file with headings, lists, task lists, code blocks, tables, quotes/callouts, inline & block math, and Mermaid diagrams
- Engine metrics measured headlessly: parse (Markdown→AST), import (→ editor model), full projection (rendering the whole document to rich text at once)

## Launch speed

| Scenario | To interactive window |
|---|---|
| Warm launch (typical) | **≈ 0.75 s** |

Mox lives as a menu-bar agent; closing the window drops the Dock icon, flushes the render caches, and returns freed pages to the OS. The window and open documents are kept, so "Show Main Window" restores instantly.

## Parse & render (by document size)

Each size is measured cold in its **own process** to avoid cross-contamination:

| Lines | Size | Parse | Import | Full projection | Memory Δ |
|---|---|---|---|---|---|
| 2,000 | 44 KB | 24 ms | 5 ms | 0.28 s | 26 MB |
| 10,000 | 223 KB | 110 ms | 22 ms | 1.25 s | 103 MB |
| 25,000 | 558 KB | 276 ms | 55 ms | 3.24 s | 251 MB |
| 50,000 | 1.1 MB | 556 ms | 113 ms | 7.82 s | 521 MB |
| 100,000 | 2.14 MB | 1.10 s | 217 ms | 18.56 s | 1.21 GB |

Takeaways:

- **Parse and import scale linearly and stay fast** — even 100k lines goes Markdown→AST→editor model in ~1.3 s.
- **Full projection is the main cost for large docs**: it renders the entire document to rich text in one pass. Everyday and even very large documents (≤ 10k–25k lines) open within a few seconds; an extreme 100k-line single file hits the ceiling (~18 s / ~1.2 GB).
- Real-world single files are rarely 100k lines — that's an intentional stress ceiling.

## Memory

- Opening the bundled example doc (23 diagram types) uses ~**244 MB**; closing it drops back ~120 MB (macOS keeps freed pages in the allocator — normal).
- The three decoded-bitmap caches (images / diagrams / math) are all `NSCache`, auto-evicting under system memory pressure; they're flushed when the last document closes or the app retreats to the menu bar.
- Diagram caches are **vector PDF** (a few KB each), not full bitmaps.

## Native rendering

- 23 Mermaid diagram types are **drawn natively**, no WebKit; they stay crisp at any zoom/Retina scale (inline vector PDF).
- Export offers a **Typst print-grade PDF** option (real pagination, page numbers, headers/footers).

## Conclusion & direction

- **Fast launch** (~0.75 s), **fast parse** (~1.1 s for 100k lines), and **fast open** for typical documents.
- The bottleneck for extreme single files (50k+ lines) is the one-shot full projection. The planned optimization is **viewport-based lazy projection** — render only visible and nearby blocks, the rest on demand — so documents of any size open instantly.

> The benchmark script and raw data ship with the source; results reproduce in a Release build.
