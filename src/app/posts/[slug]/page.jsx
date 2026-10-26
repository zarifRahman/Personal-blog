import { notFound } from "next/navigation";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Menu from "@/components/Menu/Menu";
import { posts, getPost } from "@/content/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const data = getPost(params.slug);
  if (!data) return {};
  return { title: `${data.title} | Zarif`, description: data.title };
}

const SinglePage = ({ params }) => {
  const { slug } = params;
  const data = getPost(slug);
  if (!data) notFound();

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data.title}</h1>
          <div className={styles.user}>
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data.author}</span>
              <span className={styles.date}>
                {data.createdAt.substring(0, 10)} · {data.views} views
              </span>
            </div>
          </div>
        </div>
        {data.img && (
          <div className={styles.imageContainer}>
            <Image src={data.img} alt="" fill className={styles.image} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: data.desc }}
          />
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default SinglePage;
