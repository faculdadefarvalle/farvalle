import Link from "next/link";
import { LuArrowRight, LuChevronRight } from "react-icons/lu";
import { getLatestPosts, SAMPLE_POSTS } from "../../lib/posts";
import { PostCard } from "../PostCard";
import styles from "./News.module.scss";

type NewsProps = {
  title?: string;
};

export async function News({ title }: NewsProps) {
  const fetched = await getLatestPosts(3);
  const posts = fetched.length || process.env.NEXT_PUBLIC_PREVIEW_SAMPLES !== "1" ? fetched : SAMPLE_POSTS;

  return (
    <section className={`fv-section ${styles.section}`} aria-labelledby="news-title">
      <div className="fv-container">
        <div className={styles.head}>
          <div>
            <span className="fv-eyebrow">Notícias</span>
            <h2 id="news-title" className="fv-title">
              {title && title !== "Últimas Novidades" ? title : "Acontece na Farvalle"}
            </h2>
            <p className="fv-lead">Fique por dentro das novidades, eventos e iniciativas da nossa instituição.</p>
          </div>
          <Link href="/noticias" className="fv-btn fv-btn--outline">
            Ver todas as notícias <LuChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {posts.length ? (
          <div className={styles.grid}>
            {posts.map((post, index) => (
              <PostCard key={post.uid || index} post={post} />
            ))}
          </div>
        ) : (
          <div className={`fv-card ${styles.empty}`}>
            <p>Em breve, novidades da Farvalle por aqui.</p>
            <Link href="/noticias">
              Ver notícias <LuArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
