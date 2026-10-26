import React from "react";
import styles from "./cardList.module.css";
import Card from "../card/Card";
import Pagination from "../pagination/Pagination";
import { posts as allPosts } from "@/content/posts";

const POST_PER_PAGE = 4;

const getData = (page, cat) => {
  const filtered = cat ? allPosts.filter((p) => p.catSlug === cat) : allPosts;
  const count = filtered.length;
  const start = POST_PER_PAGE * (page - 1);
  return { posts: filtered.slice(start, start + POST_PER_PAGE), count };
};

const CardList = ({ page, cat }) => {
  const { posts, count } = getData(page, cat);

  const hasPrev = POST_PER_PAGE * (page - 1) > 0;
  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
        {posts?.length ? (
          posts.map((item) => <Card item={item} key={item.slug} />)
        ) : (
          <p className={styles.empty}>$ no posts in this category yet.</p>
        )}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
};

export default CardList;
