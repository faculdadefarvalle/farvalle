import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuNewspaper } from "react-icons/lu";
import type { PostSummary } from "../../lib/posts";
import styles from "./style.module.scss";

type PostCardProps = {
  post: PostSummary;
};

export function PostCard({ post }: PostCardProps) {
  const href = post.uid ? `/posts/${post.uid}` : "/noticias";
  return (
    <article className={`fv-card ${styles.card}`}>
      <Link href={href} className={styles.media} aria-hidden="true" tabIndex={-1}>
        {post.imageUrl ? (
          <Image src={post.imageUrl} alt={post.imageAlt} width={640} height={400} sizes="(max-width: 640px) 100vw, 380px" unoptimized={post.imageUrl.startsWith("http")} />
        ) : (
          <span className={styles.placeholder}>
            <LuNewspaper size={36} aria-hidden="true" />
          </span>
        )}
      </Link>
      <div className={styles.body}>
        <time dateTime={post.date} className={styles.date}>
          {post.dateLabel}
        </time>
        <h3>
          <Link href={href}>{post.title}</Link>
        </h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <Link href={href} className={styles.more}>
          Ler mais <LuArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
