import React from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";

const Navbar = () => {
  return (
    <header className={styles.container}>
      <Link href='/' className={styles.logo} aria-label='Zarif blog home'>
        <span className={styles.prompt}>~/</span>
        <span>zarif blog</span>
      </Link>
      <nav className={styles.links} aria-label='Main navigation'>
        <ThemeToggle />
        <Link href='/' className={styles.link}>
          Homepage
        </Link>
        <Link href='/contact' className={styles.link}>
          Contact
        </Link>
        <Link href='/about' className={styles.link}>
          About
        </Link>
        <a
          href='https://zarif-dev-diaries.vercel.app/'
          className={styles.legacyLink}
          target='_blank'
          rel='noopener noreferrer'
        >
          Old portfolio
        </a>
        <AuthLinks />
      </nav>
    </header>
  );
};

export default Navbar;
