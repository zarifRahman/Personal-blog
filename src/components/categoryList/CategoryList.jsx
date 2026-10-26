import React from "react";
import styles from "./categoryList.module.css";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/app/utils/connect";

const getData = async () => {
  try {
    return await prisma.category.findMany();
  } catch {
    return [];
  }
};

const CategoryList = async () => {
  const data = await getData();
  return (
    <div className={styles.container} id="categories">
      <h1 className={styles.title}>Popular Categories</h1>
      <div className={styles.categories}>
        {data?.length ? (
          data.map((item) => (
            <Link
              href={`/blog?cat=${item?.slug}`}
              className={`${styles.category} ${styles[item?.slug]}`}
              key={item?.id}
            >
              {item?.img && (
                <Image
                  src={item?.img}
                  alt=""
                  width={32}
                  height={32}
                  className={styles.image}
                />
              )}
              {item?.title}
            </Link>
          ))
        ) : (
          <p className={styles.empty}>
            # no categories yet — connect a database to populate.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
