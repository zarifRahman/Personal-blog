import styles from "./contact.module.css";

export const metadata = {
  title: "Contact — Zarif Shahriar Rahman",
  description: "Get in touch with Zarif — email, GitHub, portfolio and blog.",
};

const EMAIL = "zarif.shahriar.rahman@gmail.com";

const channels = [
  { label: "email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "github", value: "github.com/zarifRahman", href: "https://github.com/zarifRahman" },
  { label: "portfolio", value: "zarif-portfolio.vercel.app", href: "https://zarif-portfolio.vercel.app/" },
  { label: "blog", value: "zarif-dev-diaries.vercel.app", href: "https://zarif-dev-diaries.vercel.app/" },
  { label: "location", value: "Bangladesh 🇧🇩", href: null },
];

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <span className={styles.prompt}>
        ~/zarif <span className={styles.dollar}>$</span> ./contact.sh
      </span>
      <h1 className={styles.title}>Get in touch</h1>
      <p className={styles.intro}>
        Open to collaborating on interesting projects, frontend work, and writing.
        The fastest way to reach me is email — I read everything.
      </p>

      <ul className={styles.list}>
        {channels.map((c) => (
          <li className={styles.row} key={c.label}>
            <span className={styles.key}>{c.label}</span>
            {c.href ? (
              <a
                className={styles.val}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                {c.value}
              </a>
            ) : (
              <span className={styles.valPlain}>{c.value}</span>
            )}
          </li>
        ))}
      </ul>

      <a className={styles.cta} href={`mailto:${EMAIL}`}>
        $ send me an email
      </a>
    </main>
  );
}
