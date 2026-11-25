import type { Metadata } from "next";
import { LuNewspaper } from "react-icons/lu";
import { PageHero } from "../components/PageHero";
import { PostCard } from "../components/PostCard";
import { Cta } from "../components/Home/Cta";
import { getAllPosts, SAMPLE_POSTS } from "../lib/posts";
import styles from "./style.module.scss";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Novidades, eventos e iniciativas da Faculdade Regional do Valle.",
};

export const revalidate = 300;

export default async function NoticiasPage() {
  const fetched = await getAllPosts();
  const posts = fetched.length || process.env.NEXT_PUBLIC_PREVIEW_SAMPLES !== "1" ? fetched : SAMPLE_POSTS;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Notícias" }]}
        eyebrow="Notícias"
        title="Acontece na Farvalle"
        text="Fique por dentro das novidades, eventos e iniciativas da nossa instituição."
        compact
      />

      <section className={`fv-section ${styles.section}`}>
        <div className="fv-container">
          {posts.length ? (
            <div className={styles.grid}>
              {posts.map((post) => (
                <PostCard key={post.uid || post.title} post={post} />
              ))}
            </div>
          ) : (
            <div className={`fv-card ${styles.empty}`}>
              <span className="fv-icon-circle">
                <LuNewspaper size={22} aria-hidden="true" />
              </span>
              <p>Ainda não há notícias publicadas. Em breve, novidades da Farvalle por aqui.</p>
            </div>
          )}
        </div>
      </section>

      <Cta compact />
    </>
  );
}
