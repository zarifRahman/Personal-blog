import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./menuPosts.module.css";
import { posts } from "@/content/posts";

const MenuPosts = ({ withImage }) => {
  const popular = [...posts].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <div className={styles.items}>
      {popular.map((p) => (
        <Link href={`/posts/${p.slug}`} className={styles.item} key={p.slug}>
          {withImage && p.img && (
            <div className={styles.imageContainer}>
              <Image src={p.img} alt="" fill className={styles.image} />
            </div>
          )}
          <div className={styles.textContainer}>
            <span className={styles.category}>{p.catSlug}</span>
            <h3 className={styles.postTitle}>{p.title}</h3>
            <div className={styles.detail}>
              <span className={styles.username}>{p.author}</span>
              <span className={styles.date}> · {p.createdAt.substring(0, 10)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPosts;
