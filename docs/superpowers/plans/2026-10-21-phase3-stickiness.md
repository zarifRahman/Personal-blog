# Phase 3 — Stickiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the four engagement features that keep visitors: ⌘K command palette, reading-progress bar + TOC scroll-spy, series prev/next + related, and an RSS feed.

**Architecture:** A global client command palette (`cmdk`) mounted in the root layout, driven by the notes list. A fixed reading-progress bar + scroll-spy via `IntersectionObserver` (no deps). Prev/next + related derived from the `src/content/notes` helpers already built in Phase 2. RSS via an app-router route handler that hand-writes XML (no dep).

**Tech Stack:** Next.js 13 app router, `cmdk`, React `IntersectionObserver`.

**Depends on:** Phase 2 (`src/content/notes` helpers: `allNotes`, `seriesNeighbors`, `relatedNotes`).

**Verification model:** RSS XML shape gets a runnable `assert` self-check. Palette/progress/scroll-spy verified via browser-automation (interactive).

---

### Task 1: Install cmdk

**Files:** `package.json`

- [ ] **Step 1: Add dep**

Run: `yarn add cmdk`

- [ ] **Step 2: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: add cmdk for command palette"
```

---

### Task 2: Command palette (⌘K)

**Files:**
- Create: `src/components/commandPalette/CommandPalette.jsx`
- Create: `src/components/commandPalette/commandPalette.module.css`
- Create: `src/components/commandPalette/notesList.js`
- Modify: `src/app/layout.js`

- [ ] **Step 1: Serializable notes list for the client palette**

The palette is a client component; it must not import server content with large bodies. Create a lean list `notesList.js`:

```js
import { allNotes } from "@/content/notes";

// Strip bodies — palette only needs nav metadata.
export const paletteNotes = allNotes().map((n) => ({
  slug: n.slug,
  title: n.title,
}));
```

- [ ] **Step 2: Palette component**

`CommandPalette.jsx`:

```jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { paletteNotes } from "./notesList";
import styles from "./commandPalette.module.css";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (href) => { setOpen(false); router.push(href); };

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <Command label="Command Menu">
          <Command.Input className={styles.input} placeholder="Type a command or search notes…" autoFocus />
          <Command.List className={styles.list}>
            <Command.Empty className={styles.empty}>No results.</Command.Empty>
            <Command.Group heading="Navigate" className={styles.group}>
              <Command.Item onSelect={() => go("/")}>Home</Command.Item>
              <Command.Item onSelect={() => go("/notes/frontend-system-design")}>Frontend System Design — series</Command.Item>
              <Command.Item onSelect={() => go("/feed.xml")}>RSS feed</Command.Item>
            </Command.Group>
            <Command.Group heading="Notes" className={styles.group}>
              {paletteNotes.map((n) => (
                <Command.Item key={n.slug} onSelect={() => go(`/notes/frontend-system-design/${n.slug}`)}>
                  {n.title}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Style palette** — centered dialog, `var(--card)` bg, `1px solid var(--line)`, mono, overlay `rgba(1,4,9,.7)`; `.input` borderless mono; items highlight with `--accentSoft` on `[data-selected="true"]` (cmdk sets this). Respect `prefers-reduced-motion` for any transition.

- [ ] **Step 4: Mount in layout**

In `src/app/layout.js`, import and render `<CommandPalette />` inside `<body>` (once, outside page content). Add a small hint somewhere in the navbar later if desired ("⌘K").

- [ ] **Step 5: Browser verify**

`yarn dev` + browser-automation: press Cmd/Ctrl+K, palette opens, typing filters, selecting a note navigates, Esc/overlay click closes. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/commandPalette/ src/app/layout.js
git commit -m "feat(engagement): cmdk command palette"
```

---

### Task 3: Reading progress bar

**Files:**
- Create: `src/components/readingProgress/ReadingProgress.jsx`
- Create: `src/components/readingProgress/readingProgress.module.css`
- Modify: `src/app/notes/frontend-system-design/[slug]/page.jsx`

- [ ] **Step 1: Progress component**

```jsx
"use client";
import { useEffect, useState } from "react";
import styles from "./readingProgress.module.css";

export default function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className={styles.bar} style={{ width: `${pct}%` }} aria-hidden="true" />;
}
```

- [ ] **Step 2: Style** — `.bar` fixed top, height 3px, `background: var(--accent)`, `z-index` above nav, no transition under `prefers-reduced-motion`.

- [ ] **Step 3: Mount on article page** — render `<ReadingProgress />` at top of the article `page.jsx` return.

- [ ] **Step 4: Commit**

```bash
git add src/components/readingProgress/ "src/app/notes/frontend-system-design/[slug]/page.jsx"
git commit -m "feat(engagement): reading progress bar"
```

---

### Task 4: TOC scroll-spy

**Files:**
- Create: `src/components/tableOfContents/TableOfContents.jsx`
- Create: `src/components/tableOfContents/tableOfContents.module.css`
- Modify: `src/app/notes/frontend-system-design/[slug]/page.jsx`

- [ ] **Step 1: Client TOC with IntersectionObserver**

```jsx
"use client";
import { useEffect, useState } from "react";
import styles from "./tableOfContents.module.css";

export default function TableOfContents({ items }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    items.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={styles.toc} aria-label="On this page">
      <span className={styles.label}>ON THIS PAGE</span>
      {items.map((h) => (
        <a key={h.id} href={`#${h.id}`} className={active === h.id ? styles.active : ""}>
          {h.text}
        </a>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Style** — vertical links `--softTextColor`; `.active` link `--accent` with a left border; sticky `top: 100px`.

- [ ] **Step 3: Swap static aside for `<TableOfContents items={toc} />`** in the article `page.jsx` (replace the inline `<aside>` built in Phase 2 Task 6).

- [ ] **Step 4: Browser verify** — scroll article, confirm active TOC item tracks the section in view; clicking jumps with correct offset.

- [ ] **Step 5: Commit**

```bash
git add src/components/tableOfContents/ "src/app/notes/frontend-system-design/[slug]/page.jsx"
git commit -m "feat(engagement): TOC scroll-spy"
```

---

### Task 5: Series prev/next + related

**Files:**
- Create: `src/components/noteFooter/NoteFooter.jsx`
- Create: `src/components/noteFooter/noteFooter.module.css`
- Modify: `src/app/notes/frontend-system-design/[slug]/page.jsx`

- [ ] **Step 1: Footer nav component (server component, pure data)**

```jsx
import Link from "next/link";
import styles from "./noteFooter.module.css";

const href = (slug) => `/notes/frontend-system-design/${slug}`;

export default function NoteFooter({ prev, next, related }) {
  return (
    <footer className={styles.wrap}>
      <div className={styles.nav}>
        {prev ? (
          <Link href={href(prev.slug)} className={styles.prev}>
            <span className={styles.dir}>← prev</span>
            <span className={styles.title}>{prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={href(next.slug)} className={styles.next}>
            <span className={styles.dir}>next →</span>
            <span className={styles.title}>{next.title}</span>
          </Link>
        ) : <span />}
      </div>
      {related.length > 0 && (
        <div className={styles.related}>
          <span className={styles.label}>RELATED</span>
          {related.map((r) => (
            <Link key={r.slug} href={href(r.slug)} className={styles.relItem}>{r.title}</Link>
          ))}
        </div>
      )}
    </footer>
  );
}
```

- [ ] **Step 2: Style** — `.nav` two-column grid (prev left, next right-aligned), terminal panels; `.related` list below with `#`-prefixed mono links.

- [ ] **Step 3: Wire into article page**

In `page.jsx`, import `seriesNeighbors`, `relatedNotes` from `@/content/notes` and `NoteFooter`; after `</article>` (still inside layout or below it):

```jsx
const { prev, next } = seriesNeighbors(params.slug);
const related = relatedNotes(params.slug);
// ...render after the article:
<NoteFooter prev={prev} next={next} related={related} />
```

- [ ] **Step 4: Browser verify** — article shows correct prev/next (order-based) and related (shared-tag) links that navigate.

- [ ] **Step 5: Commit**

```bash
git add src/components/noteFooter/ "src/app/notes/frontend-system-design/[slug]/page.jsx"
git commit -m "feat(engagement): series prev/next + related notes"
```

---

### Task 6: RSS feed

**Files:**
- Create: `src/app/feed.xml/route.js`
- Create: `src/app/feed.xml/_selfcheck.mjs`
- Modify: `src/app/layout.js` (head link)

- [ ] **Step 1: Feed route handler**

```js
import { allNotes, readingTime } from "@/content/notes";

const SITE = "https://zarif.dev"; // TODO: set real production origin before deploy
const BASE = `${SITE}/notes/frontend-system-design`;

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = allNotes()
    .map((n) => `    <item>
      <title>${esc(n.title)}</title>
      <link>${BASE}/${n.slug}</link>
      <guid>${BASE}/${n.slug}</guid>
      <pubDate>${new Date(n.date).toUTCString()}</pubDate>
      <description>${esc(n.summary)} (${readingTime(n.body)} min read)</description>
    </item>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Frontend System Design — Zarif</title>
    <link>${BASE}</link>
    <description>Opinionated notes on building frontend systems.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
```

Note: `new Date(n.date)` here is fine — this runs in the Next runtime, not a workflow script.

- [ ] **Step 2: Self-check the XML shape**

`_selfcheck.mjs` (inlines minimal logic over fake notes):

```js
import assert from "node:assert";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const notes = [{ title: "A & B <x>", slug: "a", summary: "s", date: "2026-01-01" }];
const item = `<title>${esc(notes[0].title)}</title><link>/a</link>`;
assert.ok(item.includes("A &amp; B &lt;x&gt;"), "escaping works");
assert.ok(!item.includes("<x>"), "no raw angle brackets");
console.log("rss selfcheck: OK");
```

- [ ] **Step 3: Run self-check**

Run: `node src/app/feed.xml/_selfcheck.mjs`
Expected: `rss selfcheck: OK`.

- [ ] **Step 4: Add `<head>` link + confirm origin**

In `layout.js` metadata, add an alternate type link:

```js
export const metadata = {
  // ...existing...
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};
```

Set the real production origin in `SITE` (replace `https://zarif.dev` if different).

- [ ] **Step 5: Build + verify**

Run: `yarn build`, then `yarn dev` + load `http://localhost:3000/feed.xml` via browser-automation; confirm valid XML with 4 `<item>`s and `application/rss+xml` content type.

- [ ] **Step 6: Commit**

```bash
git add src/app/feed.xml/ src/app/layout.js
git commit -m "feat(engagement): RSS feed"
```
