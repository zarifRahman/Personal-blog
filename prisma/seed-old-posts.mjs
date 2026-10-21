// Seed the DB with the previous blog's posts, imported from the old
// contentlayer repo's MDX files. One-shot, idempotent (upserts by slug).
//
//   1. set DATABASE_URL in .env (MongoDB)
//   2. npx prisma generate   (if not already)
//   3. node prisma/seed-old-posts.mjs
//
// Source repo path is configurable below in case the old repo moves.

import { PrismaClient } from "@prisma/client";
import matter from "gray-matter";
import { marked } from "marked";
import { readFileSync, readdirSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const SRC_REPO = "/Users/shikho/Desktop/zarif-blog";
const CONTENT_DIR = join(SRC_REPO, "content");
const SRC_IMG_DIR = join(SRC_REPO, "public", "blogs");
const DEST_IMG_DIR = join(process.cwd(), "public", "blogs");

const AUTHOR = { email: "zarif.shahriar@shikho.com", name: "Zarif Shahriar" };
// All imported posts are React/frontend → one category.
const CATEGORY = { slug: "coding", title: "Coding" };

const prisma = new PrismaClient();

// Map an old frontmatter image path to a local /blogs/<file>, copying the file.
function importImage(fmImage) {
  if (!fmImage) return null;
  const file = basename(fmImage);
  const from = join(SRC_IMG_DIR, file);
  if (!existsSync(from)) return null;
  if (!existsSync(DEST_IMG_DIR)) mkdirSync(DEST_IMG_DIR, { recursive: true });
  copyFileSync(from, join(DEST_IMG_DIR, file));
  return `/blogs/${file}`;
}

async function main() {
  // User + Category must exist first (Post has FKs to both).
  await prisma.user.upsert({
    where: { email: AUTHOR.email },
    update: {},
    create: { email: AUTHOR.email, name: AUTHOR.name },
  });
  await prisma.category.upsert({
    where: { slug: CATEGORY.slug },
    update: {},
    create: { slug: CATEGORY.slug, title: CATEGORY.title },
  });

  const slugs = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let n = 0;
  for (const slug of slugs) {
    const mdxPath = join(CONTENT_DIR, slug, "index.mdx");
    if (!existsSync(mdxPath)) continue;

    const { data: fm, content } = matter(readFileSync(mdxPath, "utf8"));
    const html = marked.parse(content);
    const img = importImage(fm.image);
    // Seed a plausible view count so "Most Popular" ordering is meaningful.
    const views = 40 + (content.length % 460);

    await prisma.post.upsert({
      where: { slug },
      update: { title: fm.title, desc: html, img, views },
      create: {
        slug,
        title: fm.title,
        desc: html,
        img,
        views,
        catSlug: CATEGORY.slug,
        userEmail: AUTHOR.email,
      },
    });
    n++;
    console.log(`  ✓ ${slug} (${views} views)`);
  }
  console.log(`Seeded ${n} posts.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
