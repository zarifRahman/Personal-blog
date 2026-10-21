# Phase 2 — Frontend System Design Notes Series Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `frontend-system-design` into a real, content-driven notes series — a series index + per-note article pages rendered from version-controlled markdown, with 4 drafted articles, read time, and copy-able code blocks.

**Architecture:** Each note is a plain JS module exporting `{slug, title, summary, series, order, tags, date, body}` where `body` is a markdown string. `src/content/notes/index.js` collects + sorts them and exposes pure helpers (`readingTime`, `tableOfContents`). Articles render with `react-markdown` + `remark-gfm` + `rehype-slug` + `rehype-highlight`; a custom code renderer adds the copy button. Separate from the DB blog — no DB writes.

**Tech Stack:** Next.js 13 app router, `react-markdown`, `remark-gfm`, `rehype-slug`, `rehype-highlight`, CSS Modules.

**Verification model:** Pure helpers (`readingTime`, `tableOfContents`) get a runnable `assert` self-check (ponytail). Pages verified via `yarn build` + browser-automation.

---

### Task 1: Install dependencies

**Files:** `package.json`

- [ ] **Step 1: Add deps**

Run: `yarn add react-markdown remark-gfm rehype-slug rehype-highlight`
Expected: added to `package.json`, lockfile updated.

- [ ] **Step 2: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: add markdown rendering deps for notes series"
```

---

### Task 2: Content model + pure helpers (with self-check)

**Files:**
- Create: `src/content/notes/index.js`
- Create: `src/content/notes/_selfcheck.mjs` (runnable check, not shipped to a route)

- [ ] **Step 1: Write helpers + collector**

`src/content/notes/index.js`:

```js
// Note modules are registered here. Each default-exports:
// { slug, title, summary, series, order, tags, date, body }
import stateThatScales from "./state-that-scales";
import mentalModel from "./mental-model";
import renderingOnTheWeb from "./rendering-on-the-web";
import performanceIsAFeeling from "./performance-is-a-feeling";

const notes = [mentalModel, stateThatScales, renderingOnTheWeb, performanceIsAFeeling]
  .sort((a, b) => a.order - b.order);

export function allNotes() {
  return notes;
}

export function getNote(slug) {
  return notes.find((n) => n.slug === slug) || null;
}

// ~200 wpm, rounded up, min 1
export function readingTime(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Parse "## Heading" lines into { id, text }. id matches rehype-slug output:
// lowercase, spaces -> "-", strip non-word chars.
export function tableOfContents(body) {
  return body
    .split("\n")
    .filter((line) => /^##\s+/.test(line))
    .map((line) => {
      const text = line.replace(/^##\s+/, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      return { id, text };
    });
}

// prev/next within the same series by order
export function seriesNeighbors(slug) {
  const i = notes.findIndex((n) => n.slug === slug);
  return {
    prev: i > 0 ? notes[i - 1] : null,
    next: i >= 0 && i < notes.length - 1 ? notes[i + 1] : null,
  };
}

// related = shares >=1 tag, excluding self, max 3
export function relatedNotes(slug, limit = 3) {
  const self = getNote(slug);
  if (!self) return [];
  return notes
    .filter((n) => n.slug !== slug && n.tags.some((t) => self.tags.includes(t)))
    .slice(0, limit);
}
```

- [ ] **Step 2: Write the self-check**

`src/content/notes/_selfcheck.mjs` (standalone, inlines the pure fns to stay runnable without the content modules):

```js
import assert from "node:assert";

const readingTime = (body) =>
  Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 200));

const tableOfContents = (body) =>
  body.split("\n").filter((l) => /^##\s+/.test(l)).map((line) => {
    const text = line.replace(/^##\s+/, "").trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
    return { id, text };
  });

assert.equal(readingTime("one two three"), 1);
assert.equal(readingTime(Array(400).fill("w").join(" ")), 2);
assert.deepEqual(tableOfContents("# Title\n## The Three Layers\nbody\n## Feedback!"), [
  { id: "the-three-layers", text: "The Three Layers" },
  { id: "feedback", text: "Feedback!" },
]);
console.log("notes helpers: OK");
```

- [ ] **Step 3: Run the self-check**

Run: `node src/content/notes/_selfcheck.mjs`
Expected: prints `notes helpers: OK`, exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/content/notes/index.js src/content/notes/_selfcheck.mjs
git commit -m "feat(notes): content model + pure helpers with self-check"
```

---

### Task 3: Draft the 4 note modules (content)

**Files:**
- Create: `src/content/notes/mental-model.js` (order 1, flagship — evolve existing static draft)
- Create: `src/content/notes/state-that-scales.js` (order 2)
- Create: `src/content/notes/rendering-on-the-web.js` (order 3)
- Create: `src/content/notes/performance-is-a-feeling.js` (order 4)

Each module shape:

```js
const note = {
  slug: "mental-model",
  title: "A Practical Mental Model for Frontend System Design",
  summary: "Start with meaning, name the behavior, choose the smallest material.",
  series: "frontend-system-design",
  order: 1,
  tags: ["architecture", "mental-models"],
  date: "2026-10-21",
  body: `# A Practical Mental Model for Frontend System Design

...markdown with ## headings, prose (readable, opinionated), at least one
\`\`\`js fenced code block, one blockquote...`,
};
export default note;
```

- [ ] **Step 1: Write `mental-model.js`** — carry over the three-layers content already in the static page (Meaning / Behavior / Material), expand to ~900 words. Headings: `## The Three Layers`, `## Boundaries That Help`, `## Designing Feedback`. Include a code block showing a thin boundary (e.g. a typed fetch edge).

- [ ] **Step 2: Write `state-that-scales.js`** — ~900 words. Headings: `## The Real Question`, `## Locality of State`, `## Server State vs UI State`, `## Choosing a Tool`. Code block contrasting prop-drilling vs a small context/store.

- [ ] **Step 3: Write `rendering-on-the-web.js`** — ~900 words. Headings: `## CSR, SSR, SSG`, `## Streaming and Suspense`, `## Choosing Per Route`, `## The Cost of Hydration`. Code block with an app-router server/client split.

- [ ] **Step 4: Write `performance-is-a-feeling.js`** — ~900 words. Headings: `## Perceived vs Measured`, `## Loading States as Architecture`, `## Motion and Hierarchy`, `## Budgets That Stick`. Code block with a skeleton/suspense example.

- [ ] **Step 5: Re-run self-check + verify registration**

Run: `node src/content/notes/_selfcheck.mjs` (still OK) and confirm all 4 import cleanly — `node -e "import('./src/content/notes/index.js').catch(e=>{})"` is not reliable for JSX-free check; instead rely on Task 5 build. Skip extra check here.

- [ ] **Step 6: Commit**

```bash
git add src/content/notes/*.js
git commit -m "content(notes): draft 4 frontend system design notes"
```

---

### Task 4: Markdown renderer + copy-able code block

**Files:**
- Create: `src/components/noteContent/NoteContent.jsx`
- Create: `src/components/noteContent/noteContent.module.css`
- Create: `src/components/noteContent/CodeBlock.jsx`

- [ ] **Step 1: CodeBlock with copy button (client component)**

`CodeBlock.jsx`:

```jsx
"use client";
import { useState } from "react";
import styles from "./noteContent.module.css";

export default function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const text = String(children).replace(/\n$/, "");
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className={styles.codeWrap}>
      <button className={styles.copyBtn} onClick={copy} type="button" aria-label="Copy code">
        {copied ? "copied ✓" : "copy"}
      </button>
      <pre><code className={className}>{children}</code></pre>
    </div>
  );
}
```

- [ ] **Step 2: NoteContent wrapping react-markdown**

`NoteContent.jsx`:

```jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import CodeBlock from "./CodeBlock";
import styles from "./noteContent.module.css";

export default function NoteContent({ body }) {
  return (
    <div className={styles.prose}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          pre: ({ children }) => children, // CodeBlock renders its own <pre>
          code({ inline, className, children }) {
            if (inline) return <code className={styles.inlineCode}>{children}</code>;
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 3: Prose + code styles**

`noteContent.module.css`: `.prose` uses `var(--font-serif)`, 16px, line-height 1.75, max-width 68ch; `h1/h2` mono with `--accent` and scroll-margin-top for anchor offset; `.codeWrap` relative, dark `#010409` bg, `1px solid var(--line)`, rounded; `.copyBtn` absolute top-right, mono, `--softTextColor`; `blockquote` left border `--accent2`; `.inlineCode` mono `var(--softBg)` chip.

- [ ] **Step 4: Highlight theme**

Import a highlight.js theme in `globals.css` and tune to palette. Add:

```css
@import "highlight.js/styles/github-dark.css";
```

(verify the path resolves from the installed `highlight.js` brought in by `rehype-highlight`; if not, copy the theme CSS into `globals.css`).

- [ ] **Step 5: Build check**

Run: `yarn build`
Expected: compiles (pages added in Task 5/6 not required yet; component compiles when imported).

- [ ] **Step 6: Commit**

```bash
git add src/components/noteContent/ src/app/globals.css
git commit -m "feat(notes): markdown renderer + copy-able code blocks"
```

---

### Task 5: Series index page

**Files:**
- Modify: `src/app/notes/frontend-system-design/page.jsx`
- Modify: `src/app/notes/frontend-system-design/page.module.css`

- [ ] **Step 1: Rewrite index as a data-driven list**

```jsx
import Link from "next/link";
import { allNotes, readingTime } from "@/content/notes";
import styles from "./page.module.css";

export const metadata = {
  title: "Frontend System Design — Notes | Zarif",
  description: "A series of opinionated notes on building frontend systems that stay understandable as products grow.",
};

export default function SeriesIndex() {
  const notes = allNotes();
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.prompt}>~/notes/frontend-system-design <span className={styles.dollar}>$</span> ls</span>
        <h1>Frontend System Design</h1>
        <p className={styles.intro}>Opinionated notes on building interfaces that behave like systems — not screens.</p>
      </header>
      <ol className={styles.list}>
        {notes.map((n) => (
          <li key={n.slug}>
            <Link href={`/notes/frontend-system-design/${n.slug}`} className={styles.item}>
              <span className={styles.num}>{String(n.order).padStart(2, "0")}</span>
              <span className={styles.body}>
                <span className={styles.title}>{n.title}</span>
                <span className={styles.summary}>{n.summary}</span>
                <span className={styles.readtime}>{readingTime(n.body)} min read</span>
              </span>
              <span className={styles.arrow}>↗</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
```

- [ ] **Step 2: Style index** — terminal panel list; `.num` mono `--accent`; `.title` mono; `.summary` serif `--softTextColor`; `.readtime` mono small; `.prompt`/`.dollar` like the hero.

- [ ] **Step 3: Commit**

```bash
git add src/app/notes/frontend-system-design/page.jsx src/app/notes/frontend-system-design/page.module.css
git commit -m "feat(notes): data-driven series index"
```

---

### Task 6: Article page `[slug]`

**Files:**
- Create: `src/app/notes/frontend-system-design/[slug]/page.jsx`
- Create: `src/app/notes/frontend-system-design/[slug]/article.module.css`

- [ ] **Step 1: Article page with static params + metadata**

```jsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { allNotes, getNote, readingTime, tableOfContents } from "@/content/notes";
import NoteContent from "@/components/noteContent/NoteContent";
import styles from "./article.module.css";

export function generateStaticParams() {
  return allNotes().map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }) {
  const note = getNote(params.slug);
  if (!note) return {};
  return { title: `${note.title} | Zarif`, description: note.summary };
}

export default function ArticlePage({ params }) {
  const note = getNote(params.slug);
  if (!note) notFound();
  const toc = tableOfContents(note.body);
  return (
    <main className={styles.page}>
      <Link href="/notes/frontend-system-design" className={styles.back}>← the series</Link>
      <header className={styles.header}>
        <span className={styles.prompt}>~/notes/frontend-system-design <span className={styles.dollar}>$</span> cat {note.slug}.md</span>
        <h1>{note.title}</h1>
        <div className={styles.meta}><span>By Zarif</span><span>{note.date}</span><span>{readingTime(note.body)} min read</span></div>
      </header>
      <div className={styles.layout}>
        <aside className={styles.toc} aria-label="On this page">
          <span className={styles.tocLabel}>ON THIS PAGE</span>
          {toc.map((h) => <a key={h.id} href={`#${h.id}`}>{h.text}</a>)}
        </aside>
        <article className={styles.article}>
          <NoteContent body={note.body} />
        </article>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Style article layout** — two-column (`toc` sticky aside + `article`), collapses to single column under ~900px. Prompt header styling reused. `scroll-margin-top` on headings so anchor links clear the fixed progress bar (Phase 3).

- [ ] **Step 3: Build + browser verify**

Run: `yarn build` (expect `generateStaticParams` to prerender 4 slugs).
Then `yarn dev` + browser-automation: load `/notes/frontend-system-design` and one article, confirm no console errors, serif body renders, code blocks highlighted, copy button present, TOC anchors jump.

- [ ] **Step 4: Commit**

```bash
git add "src/app/notes/frontend-system-design/[slug]/"
git commit -m "feat(notes): article page with TOC, read time, code blocks"
```
