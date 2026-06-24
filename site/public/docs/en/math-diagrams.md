# Math · Diagrams · Canvas

Mox renders math, diagrams and a canvas inline — write technical docs without leaving the editor.

## Math

Rendered natively by SwiftMath:

- Inline: `$E = mc^2$`
- Display: wrap with `$$ … $$` (centered).

```
$$
\int_{a}^{b} f(x)\,dx = F(b) - F(a)
$$
```

## Diagrams

Tag a code block with the right language for live rendering:

- ` ```mermaid ` — flowcharts, sequence, Gantt, mindmaps, plus bar/line charts (`xychart-beta`) and pie charts (`pie`)

Diagrams are cached, so they don't flicker while you edit.

## Mind-map canvas

- Click "Canvas" at the top-right, or run "Generate mind-map canvas" on a Markdown doc.
- Heading levels become Excalidraw nodes — drag, connect, sketch freely.
- The canvas is saved as `.excalidraw` in your workspace for re-editing.
