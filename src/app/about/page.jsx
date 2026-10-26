import Link from "next/link";
import styles from "./about.module.css";

export const metadata = {
  title: "About — Zarif Shahriar Rahman",
  description:
    "Frontend engineer from Bangladesh. 6+ years shipping web & mobile with React, Next.js, TypeScript and React Native.",
};

const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "React Native",
  "GraphQL",
  "Node.js",
  "Tailwind",
];

const projects = [
  {
    name: "Portfolio",
    desc: "Space-themed personal site — typing hero, animated skills carousel, live contact form.",
    href: "https://zarif-portfolio.vercel.app/",
  },
  {
    name: "DX-Ball",
    desc: "Fullscreen brick-breaker built with Next.js + Canvas 2D.",
    href: "https://github.com/zarifRahman/dx-ball",
  },
  {
    name: "Dev Diaries",
    desc: "My blog — writing about web dev and the things I learn.",
    href: "https://zarif-dev-diaries.vercel.app/",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <span className={styles.prompt}>
        ~/zarif <span className={styles.dollar}>$</span> cat about.md
      </span>
      <h1 className={styles.title}>About</h1>
      <p className={styles.intro}>
        Hi — I&apos;m <strong>Zarif Shahriar Rahman</strong>, a frontend engineer
        from Bangladesh 🇧🇩 with 6+ years shipping web and mobile products. I care
        about interfaces that behave like systems: predictable, fast, and honest
        about their state. This site is where I write those ideas down.
      </p>

      <pre className={styles.code}>
        <code>
          <span className={styles.kw}>const</span> zarif = {"{"}
          {"\n"}  role: <span className={styles.str}>&quot;Frontend Engineer&quot;</span>,
          {"\n"}  location: <span className={styles.str}>&quot;Bangladesh 🇧🇩&quot;</span>,
          {"\n"}  experience: <span className={styles.str}>&quot;6+ years across web &amp; mobile&quot;</span>,
          {"\n"}  focus: [<span className={styles.str}>&quot;React&quot;</span>, <span className={styles.str}>&quot;Next.js&quot;</span>, <span className={styles.str}>&quot;TypeScript&quot;</span>, <span className={styles.str}>&quot;React Native&quot;</span>],
          {"\n"}  motto: <span className={styles.str}>&quot;Let&apos;s learn something new.&quot;</span>,
          {"\n"}
          {"}"};
        </code>
      </pre>

      <h2 className={styles.heading}>What I work with</h2>
      <div className={styles.tags}>
        {stack.map((t) => (
          <span className={styles.tag} key={t}>
            {t}
          </span>
        ))}
      </div>

      <h2 className={styles.heading}>Featured work</h2>
      <div className={styles.projects}>
        {projects.map((p) => (
          <a
            className={styles.project}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            key={p.name}
          >
            <span className={styles.projectName}>{p.name}</span>
            <span className={styles.projectDesc}>{p.desc}</span>
            <span className={styles.projectArrow}>↗</span>
          </a>
        ))}
      </div>

      <p className={styles.outro}>
        Want to talk? <Link href="/contact" className={styles.link}>→ get in touch</Link>.
      </p>
    </main>
  );
}
