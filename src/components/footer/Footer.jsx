import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          <Image src='/zarif.jpeg' alt='zarif blog' width={50} height={50} />
          <h1 className={styles.logoText}>Zarif blog</h1>
        </div>
        <p className={styles.desc}>
          Opinionated notes on frontend architecture, performance, and the craft
          of building interfaces that stay understandable as products grow.
        </p>
        <div className={styles.icons}>
          <Image src='/facebook.png' alt='' width={18} height={18} />
          <Image src='/instagram.png' alt='' width={18} height={18} />
          <Image src='/tiktok.png' alt='' width={18} height={18} />
          <Image src='/youtube.png' alt='' width={18} height={18} />
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}>Links</span>
          <Link href='/'>Homepage</Link>
          <Link href='/blog'>Blog</Link>
          <Link href='/write'>Write</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Tags</span>
          <Link href='/blog?cat=coding'>Coding</Link>
          <Link href='/blog?cat=react'>React</Link>
          <Link href='/blog?cat=javascript'>JavaScript</Link>
          <Link href='/blog?cat=performance'>Performance</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Social</span>
          <Link href='/'>Facebook</Link>
          <Link href='/'>Instagram</Link>
          <Link href='/'>Tiktok</Link>
          <Link href='/'>Youtube</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
