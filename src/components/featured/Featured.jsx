import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";

const Featured = () => {
  return (
    <div className={styles.container}>
      {/* Big title --- first */}
      <h1 className={styles.title}>
        <b>Welcome, to Zarif&apos; blog!</b>
      </h1>
      {/* second part */}
      <div className={styles.post}>
        {/* image */}
        <div className={styles.imgContainer}>
          <Image src='/p1.jpeg' alt='' fill className={styles.image} />
        </div>
        {/* title- text - button */}
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>
            Lorem ipsum dolor sit amet alim consectetur adipisicing elit.
          </h1>
          <p className={styles.postDesc}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Cupiditate, quam nisi magni ea laborum inventore voluptatum
            laudantium repellat ducimus unde aspernatur fuga. Quo, accusantium
            quisquam! Harum unde sit culpa debitis.
          </p>
          <button className={styles.button}>Read More</button>
        </div>
      </div>
    </div>
  );
};

export default Featured;