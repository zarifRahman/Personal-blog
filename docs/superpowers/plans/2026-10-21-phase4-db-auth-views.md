# Phase 4 — DB Restore, Auth, Views Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Restore the previous blog's posts into the DB, make Google/GitHub sign-in work, and surface view counts in the UI.

**Architecture:** Posts are imported from the old contentlayer repo (`~/Desktop/zarif-blog/content/*/index.mdx`) into MongoDB via `prisma/seed-old-posts.mjs` (already written). Auth is already wired in `src/app/utils/auth.js`; it only needs `.env`. Views are already tracked (`Post.views`, incremented in the single-post route) but not displayed — this phase adds the display + orders "Most Popular" by views.

**Blocked on user:** `DATABASE_URL`, `NEXTAUTH_SECRET` (done), `NEXTAUTH_URL`, Google/GitHub OAuth creds, `FIREBASE` — all in `.env`. Code tasks below can be built now; run/verify after secrets are set.

---

### Task 1: Fill `.env` + verify DB connection (user + agent)

- [ ] **Step 1:** User fills `.env` (scaffold already created) — Mongo URI, OAuth creds, Firebase key. Redirect URIs use port **3002**.
- [ ] **Step 2:** `npx prisma generate`
- [ ] **Step 3:** `npx prisma db push` (sync schema to the Mongo DB)
- [ ] **Step 4:** Confirm connection: `node -e "const{PrismaClient}=require('@prisma/client');new PrismaClient().user.count().then(c=>{console.log('db ok',c);process.exit()})"`

---

### Task 2: Seed the old posts

**Files:** `prisma/seed-old-posts.mjs` (already written + dry-tested)

- [ ] **Step 1:** Run: `node prisma/seed-old-posts.mjs`
  Expected: copies 5 images to `public/blogs/`, upserts user + `coding` category, inserts 7 posts, prints `Seeded 7 posts.`
- [ ] **Step 2:** Browser-verify `http://localhost:3002` shows post cards; open one post → view count increments on the single page route.
- [ ] **Step 3:** Commit image assets: `git add public/blogs && git commit -m "content: restore previous blog post images"`

*(Optional: add the 2 extra posts in `zarif-blog/project files/blogs/` — web-accessibility, dev-tools — by copying their folders into `zarif-blog/content/` and re-running the seed.)*

---

### Task 3: Order "Most Popular" by views

**Files:** `src/components/menuPosts/MenuPosts.jsx`, and/or a new API query.

- [ ] **Step 1:** If MenuPosts renders static markup, switch it to fetch real posts ordered by views. Add an API query: in `src/app/api/posts/route.js` GET, support `?popular=1` → `orderBy: { views: "desc" }, take: 3`.
- [ ] **Step 2:** MenuPosts fetches `/api/posts?popular=1` and lists them with title + view count.
- [ ] **Step 3:** Browser-verify the Most Popular list reflects seeded view counts (highest first).

---

### Task 4: Display view counts (folded into terminal redesign styling)

**Files:** `src/components/card/Card.jsx` + `card.module.css`; `src/app/posts/[slug]/page.jsx` + `singlePage.module.css`.

- [ ] **Step 1:** Card: show `{post.views} views` in the card meta row (near date/category). Terminal styling: mono, `--softTextColor`, e.g. `◦ 182 views`.
- [ ] **Step 2:** Single post page: show view count in the post header meta.
- [ ] **Step 3:** Style to match the terminal theme (do this during Phase 1/2 so it's styled once).
- [ ] **Step 4:** Browser-verify counts render on cards and single post.

---

### Task 5: Verify auth end-to-end

- [ ] **Step 1:** With OAuth creds in `.env`, restart dev server.
- [ ] **Step 2:** Browser-automation (session): open `/login`, click "Sign in with Google" → completes OAuth → redirected back authenticated. Repeat for GitHub.
- [ ] **Step 3:** Confirm a `User`/`Account` row is created (PrismaAdapter) and `/write` is reachable when signed in.

*Note: OAuth cannot be fully driven headlessly (Google/GitHub login screens). Agent verifies the redirect/callback wiring + session; user confirms the actual Google/GitHub consent flow.*
