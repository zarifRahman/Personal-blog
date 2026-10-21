# Terminal Portfolio + Frontend System Design Notes — Design

**Date:** 2026-10-21
**Author:** Zarif (with Claude)
**Status:** Draft — awaiting review

## Goal

Turn the personal blog into a distinctive, sticky portfolio for a frontend
engineer, built around a real **Frontend System Design** notes series. Visual
direction: **Terminal / Developer** (dark, monospace chrome) with a **readable
serif body** for long-form reading. Success = a visitor lands, stays, reads more
than one note, and can get back (RSS / memorable identity).

This is a 3-phase mini-project. Each phase ships independently and has its own
implementation plan.

## Design direction (locked)

- **Chrome** (nav, hero, headers, code, accents): dark terminal. Background
  `#0d1117`, surfaces `#161b22`, lines `#21262d`, text `#c9d1d9`, green accent
  `#7ee787`, blue accent `#58a6ff`. Monospace UI font.
- **Body** (article prose): readable serif (Georgia / system serif), ~16px,
  line-height ~1.75, measure ~68ch, color `#cdd3da` on dark.
- Terminal motifs used sparingly as identity, not gimmick: `~/path $` prompt
  headers, green `#` headings, mono code blocks, blinking caret on hero.
- Existing light/dark toggle stays functional. **Dark is the hero**; light is a
  tuned secondary ("light terminal"). Respect `prefers-reduced-motion`.

## Borrowed patterns (design research, not REA)

From strong dev portfolios/blogs (Lee Robinson, Josh Comeau, Rauno Freiberg,
Paco Coursey, Brittany Chiang): ⌘K command palette, reading-progress bar, sticky
TOC with scroll-spy, prev/next series navigation, copy-code buttons, estimated
read time, RSS, keyboard-first nav, reduced-motion respect. We cherry-pick the
ones with the highest stickiness-per-effort (see Phase 3).

---

## Phase 1 — Terminal design system

Refactor the global theme and restyle existing homepage components to the
terminal direction. No new dependencies.

**Changes**
- `src/app/globals.css`: replace color tokens with the terminal palette above;
  add `--font-mono` (UI) and `--font-serif` (reading) CSS vars; tune `.dark` and
  `.light` blocks. Load fonts (system mono stack + Georgia; optionally one
  Google mono like JetBrains Mono via `next/font` — zero runtime dep).
- Restyle: `navbar`, `featured`, `categoryList`, `card`/`cardList`,
  `learningPath`, `footer` module CSS to match. Keep DOM/JSX mostly as-is;
  this is a visual pass, not a rewrite.
- Hero (`Featured`): terminal-flavored — prompt line, green accent, caret.

**Out of scope:** changing data flow, DB, auth. Pure presentation.

**Done when:** homepage reads as a coherent terminal portfolio in dark mode,
light mode is legible, no layout regressions, Lighthouse not worse.

---

## Phase 2 — The Frontend System Design notes series (content)

Make `frontend-system-design` a real, content-driven series — separate from the
existing DB-backed blog (no DB writes; notes are version-controlled).

### Content model

Each note is a plain JS module — no file loader, no frontmatter parser:

```
src/content/notes/
  index.js                      // collects + sorts all notes, derives series order
  state-that-scales.js
  rendering-on-the-web.js
  performance-is-a-feeling.js
  component-apis.js
```

Each note module:

```js
export default {
  slug: "state-that-scales",
  title: "Designing State That Scales",
  summary: "...",
  series: "frontend-system-design",
  order: 2,
  tags: ["state", "architecture"],
  date: "2026-10-21",
  body: `# Designing State That Scales\n\n...markdown...`,
};
```

`index.js` exports the sorted list; read time is derived from `body` word count;
TOC is derived by scanning `##` headings in `body`.

### Rendering

- `react-markdown` + `remark-gfm` (tables/lists), `rehype-slug` (heading ids for
  TOC anchors), `rehype-highlight` (code syntax highlighting). A custom `code`
  renderer adds the **copy button** and terminal styling.
- Serif body, green `#`/`##` headings, dark code blocks with a highlight.js
  theme tuned to the palette.

### Routes

- `src/app/notes/frontend-system-design/page.jsx` → **series index**: terminal
  header, list of notes with read time + summary, "the series" framing (reuse
  `LearningPath` intent).
- `src/app/notes/frontend-system-design/[slug]/page.jsx` → **article view**:
  prompt header `~/notes/frontend-system-design $ cat <slug>.md`, TOC aside,
  serif article, code blocks, prev/next (Phase 3 wires nav).
- Replace the current hand-written static note with the flagship generated note.

### Content (I draft)

1. **A practical mental model for frontend system design** (flagship — evolve
   the existing draft; the three layers).
2. **Designing State That Scales.**
3. **Rendering on the Web** (SSR/CSR/streaming trade-offs).
4. **Performance Is a Feeling** (perceived perf, loading states, motion).

Real, opinionated prose — a starting library Zarif edits/replaces later.

**Done when:** series index + 4 readable articles live, TOC anchors work, code
blocks copy, read times shown.

---

## Phase 3 — Stickiness

Build all four selected features.

- **⌘K command palette** — `cmdk` (accessible, standard; hand-rolling a11y focus
  trap + filtering is not worth it). Commands: jump to any note, go home, toggle
  theme, open RSS. Global, keyboard-first.
- **Reading progress bar + sticky TOC scroll-spy** — plain React +
  `IntersectionObserver`, no dep. Progress bar fixed top; TOC highlights the
  section in view.
- **Series prev/next + related** — derived from `index.js` metadata (series
  order for prev/next; shared tags for related). End-of-article block to pull
  readers deeper.
- **RSS feed** — `src/app/feed.xml/route.js` route handler generating XML from
  the notes list by hand (no dep). Linked in `<head>` and the palette.

**Done when:** ⌘K opens/navigates, progress+TOC track scroll, articles chain via
prev/next + related, `/feed.xml` validates.

---

## Dependencies added (all Phase 2/3, each justified)

| Dep | Phase | Why not hand-roll |
| --- | --- | --- |
| `react-markdown` | 2 | Markdown→React with plugin ecosystem; parser is not worth writing |
| `remark-gfm` | 2 | GFM tables/lists/strikethrough |
| `rehype-slug` | 2 | Heading ids for TOC anchors |
| `rehype-highlight` | 2 | Code syntax highlighting (core to the terminal identity) |
| `cmdk` | 3 | Accessible command palette; a11y + keyboard nav are the hard part |

RSS, reading progress, TOC scroll-spy, prev/next, read time: **zero deps.**

## Non-goals

- No change to the existing DB blog, auth, or comments.
- No MDX toolchain, no CMS, no analytics backend.
- No light-mode-first work — dark terminal is the hero.

## Risks

- Dark + long reading fatigue → mitigated by serif body + good measure
  (resolved in direction choice).
- `rehype-highlight` CSS theme clashing with palette → pick/tune one highlight.js
  theme in Phase 2.
- Scope creep across 3 phases → each phase is a separate plan; ship in order.
