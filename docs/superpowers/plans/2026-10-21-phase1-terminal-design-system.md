# Phase 1 — Terminal Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the homepage + shared components into a dark terminal/developer aesthetic with a readable serif reading body, no new dependencies.

**Architecture:** Replace CSS custom properties in `globals.css` with a terminal palette + two font vars (mono UI, serif reading), load fonts via `next/font` in `layout.js`, then retune each component's CSS module. JSX changes limited to the hero (`Featured`) gaining terminal prompt motifs. Dark is the hero theme; light is a tuned secondary. Existing theme toggle stays functional.

**Tech Stack:** Next.js 13 (app router), CSS Modules, `next/font`.

**Verification model:** No unit tests (visual phase). Each task ends with `yarn lint`, and the final task runs `yarn build` + a browser-automation check on `http://localhost:3000`.

---

### Task 1: Palette + font tokens

**Files:**
- Modify: `src/app/globals.css:1-55` (`:root`, `.dark`, `.light`)
- Modify: `src/app/layout.js`

- [ ] **Step 1: Load fonts via next/font in `layout.js`**

At top of `src/app/layout.js`:

```js
import { JetBrains_Mono } from "next/font/google";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
```

Add `mono.variable` to the root `<html>` or `<body>` className (whichever already carries the theme class). Example: `className={\`${mono.variable} ${theme}\`}`.

- [ ] **Step 2: Replace tokens in `globals.css`**

Replace the `:root`, `.dark`, `.light` blocks (lines ~1-55) with:

```css
:root {
  --bg: #0d1117;
  --textColor: #c9d1d9;
  --softBg: #161b22;
  --softTextColor: #8b949e;
  --card: #161b22;
  --line: #21262d;
  --accent: #7ee787;        /* terminal green */
  --accent2: #58a6ff;       /* terminal blue */
  --accentSoft: #132a1c;
  --font-mono: var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-serif: Georgia, "Times New Roman", serif;
}

.dark {
  --bg: #0d1117;
  --textColor: #c9d1d9;
  --softBg: #161b22;
  --softTextColor: #8b949e;
  --card: #161b22;
  --line: #21262d;
  --accent: #7ee787;
  --accent2: #58a6ff;
  --accentSoft: #132a1c;
}

.light {
  --bg: #f6f8fa;
  --textColor: #1f2328;
  --softBg: #eaeef2;
  --softTextColor: #57606a;
  --card: #ffffff;
  --line: #d0d7de;
  --accent: #1a7f37;        /* darker green for contrast on light */
  --accent2: #0969da;
  --accentSoft: #dafbe1;
}
```

- [ ] **Step 3: Set default UI font to mono**

In `globals.css` `body` rule add `font-family: var(--font-mono);` and `color: var(--textColor);`.

- [ ] **Step 4: Lint**

Run: `yarn lint`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.js
git commit -m "feat(theme): terminal palette + mono/serif font tokens"
```

---

### Task 2: Navbar reskin

**Files:**
- Modify: `src/components/navbar/navbar.module.css`

- [ ] **Step 1: Retune navbar CSS**

Use `var(--bg)` background with a bottom `1px solid var(--line)`, mono font, `--accent` for the active/logo mark. Add a subtle terminal touch: prefix the logo text with a green `$` or `~` via `::before` (content: "~/ ") on `.logo`. Keep existing layout/flex structure — only colors, borders, font.

- [ ] **Step 2: Lint**

Run: `yarn lint`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/navbar/navbar.module.css
git commit -m "feat(theme): terminal navbar"
```

---

### Task 3: Featured hero — terminal prompt

**Files:**
- Modify: `src/components/featured/Featured.jsx`
- Modify: `src/components/featured/featured.module.css`

- [ ] **Step 1: Add prompt motif to hero JSX**

In `Featured.jsx`, above the existing title, add a prompt line:

```jsx
<span className={styles.prompt}>~/zarif <span className={styles.dollar}>$</span> whoami</span>
```

Wrap the headline so a blinking caret can trail it: append `<span className={styles.caret} aria-hidden="true" />` after the title text. Keep existing content/structure otherwise.

- [ ] **Step 2: Style prompt + caret (reduced-motion aware)**

In `featured.module.css`:

```css
.prompt { font-family: var(--font-mono); color: var(--accent2); font-size: 14px; display: block; margin-bottom: 16px; }
.dollar { color: var(--accent); }
.caret { display: inline-block; width: 10px; height: 1.1em; margin-left: 6px; background: var(--accent); vertical-align: text-bottom; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .caret { animation: none; } }
```

Retune the rest of the hero to the palette (green accent on key words, mono).

- [ ] **Step 3: Lint**

Run: `yarn lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/featured/Featured.jsx src/components/featured/featured.module.css
git commit -m "feat(theme): terminal hero with prompt + caret"
```

---

### Task 4: CategoryList reskin

**Files:**
- Modify: `src/components/categoryList/categoryList.module.css`

- [ ] **Step 1: Retune category pills**

Style category chips as terminal tags: `var(--softBg)` background, `1px solid var(--line)`, mono, `--accent2` on hover, prefix each with `#` via `::before`. Keep layout.

- [ ] **Step 2: Lint**

Run: `yarn lint`

- [ ] **Step 3: Commit**

```bash
git add src/components/categoryList/categoryList.module.css
git commit -m "feat(theme): terminal category tags"
```

---

### Task 5: Card + CardList reskin

**Files:**
- Modify: `src/components/card/card.module.css`
- Modify: `src/components/cardList/cardList.module.css`

- [ ] **Step 1: Retune cards**

Cards: `var(--card)` bg, `1px solid var(--line)`, subtle hover lift + `--accent2` border on hover. Titles mono; excerpt in `var(--font-serif)` for reading warmth. Date/category in `--softTextColor` mono. Keep grid/layout.

- [ ] **Step 2: Lint**

Run: `yarn lint`

- [ ] **Step 3: Commit**

```bash
git add src/components/card/card.module.css src/components/cardList/cardList.module.css
git commit -m "feat(theme): terminal cards"
```

---

### Task 6: LearningPath reskin

**Files:**
- Modify: `src/components/learningPath/learningPath.module.css`

- [ ] **Step 1: Retune LearningPath**

Numbers (`01/02/03`) in mono `--accent`; lesson titles mono; body text `var(--font-serif)`. Lesson cards as bordered terminal panels (`var(--card)`, `1px solid var(--line)`, `--accent2` on hover). Label in `--accent2`. Keep grid.

- [ ] **Step 2: Lint**

Run: `yarn lint`

- [ ] **Step 3: Commit**

```bash
git add src/components/learningPath/learningPath.module.css
git commit -m "feat(theme): terminal learning path"
```

---

### Task 7: Footer + homepage shell + full verify

**Files:**
- Modify: `src/components/footer/footer.module.css`
- Modify: `src/app/homepage.module.css`

- [ ] **Step 1: Retune footer + homepage spacing**

Footer: `var(--line)` top border, `--softTextColor` mono text, `--accent2` links. Check `homepage.module.css` section spacing still reads well on dark.

- [ ] **Step 2: Build**

Run: `yarn build`
Expected: build succeeds, no errors.

- [ ] **Step 3: Browser verification**

Start dev server (`yarn dev`), then use the **browser-automation** skill to load `http://localhost:3000` and confirm: no console errors, page renders dark terminal theme, hero prompt + caret visible, cards/categories styled. Capture a screenshot.

- [ ] **Step 4: Commit**

```bash
git add src/components/footer/footer.module.css src/app/homepage.module.css
git commit -m "feat(theme): terminal footer + homepage shell"
```
