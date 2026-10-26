import React from "react";
import styles from "./featured.module.css";

const Featured = () => {
  return (
    <div className={styles.container}>
      <span className={styles.prompt}>
        ~/zarif <span className={styles.dollar}>$</span> whoami
      </span>
      <h1 className={styles.title}>
        Frontend engineer building interfaces that
        <br />
        behave like <span className={styles.accent}>systems</span>, not screens.
        <span className={styles.caret} aria-hidden="true" />
      </h1>
      <p className={styles.desc}>
        Opinionated notes on frontend architecture, performance, and the small
        decisions that make a product feel trustworthy. Part journal, part field
        guide.
      </p>
      <div className={styles.actions}>
        <a href="/blog" className={styles.primary}>
          $ read the blog
        </a>
        <a href="#categories" className={styles.secondary}>
          browse topics ↓
        </a>
      </div>
    </div>
  );
};

export default Featured;
