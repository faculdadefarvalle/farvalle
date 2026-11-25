import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as prismic from "@prismicio/client";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import { LuArrowLeft, LuCalendarDays, LuUserRound } from "react-icons/lu";
import { getLatestPosts, getPost, postSummaryFromDocument } from "../../lib/posts";
import { PostCard } from "../../components/PostCard";
import { Cta } from "../../components/Home/Cta";
import styles from "./style.module.scss";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Notícia" };
  const text = prismic.asText(post.data.content) || "";
  return {
    title: post.data.title || "Notícia",
    description: text.slice(0, 160),
    openGraph: post.data.image?.url ? { images: [{ url: post.data.image.url }] } : undefined,
  };
}

const components = {
  heading1: ({ children }: { children: React.ReactNode }) => <h2 className={styles.h2}>{children}</h2>,
  heading2: ({ children }: { children: React.ReactNode }) => <h2 className={styles.h2}>{children}</h2>,
  heading3: ({ children }: { children: React.ReactNode }) => <h3 className={styles.h3}>{children}</h3>,
  paragraph: ({ children }: { children: React.ReactNode }) => <p className={styles.p}>{children}</p>,
  list: ({ children }: { children: React.ReactNode }) => <ul className={styles.ul}>{children}</ul>,
  oList: ({ children }: { children: React.ReactNode }) => <ol className={styles.ul}>{children}</ol>,
  listItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  oListItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  image: ({ node, key }: { node: any; key?: string }) => {
    const img = (
      <Image src={node.url} quality={100} className={styles.image} width={1000} height={560} alt={node.alt || ""} />
    );
    return (
      <figure key={key} className={styles.figure}>
        {node.linkTo ? <PrismicLink field={node.linkTo}>{img}</PrismicLink> : img}
      </figure>
    );
  },
};

export default async function PostPage({ params }: ParamsProps) {
  const { id } = await params;
  const document = await getPost(id);

  if (!document) {
    notFound();
  }

  const post = document.data;
  const summary = postSummaryFromDocument(document);
  const related = await getLatestPosts(3, id);

  return (
    <>
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={`fv-container ${styles.headerInner}`}>
            <nav className="fv-breadcrumb" aria-label="Você está em">
              <Link href="/">Início</Link>
              <span aria-hidden="true">›</span>
              <Link href="/noticias">Notícias</Link>
              <span aria-hidden="true">›</span>
              <strong>{post.title}</strong>
            </nav>
            <span className="fv-eyebrow">Notícias</span>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <span>
                <LuCalendarDays size={16} aria-hidden="true" />
                <time dateTime={summary.date}>{summary.dateLabel}</time>
              </span>
              {post.author && (
                <span>
                  <LuUserRound size={16} aria-hidden="true" />
                  {post.author}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className={`fv-container ${styles.body}`}>
          {post.image?.url && (
            <figure className={styles.cover}>
              <Image
                src={post.image.url}
                alt={post.image.alt || post.title || ""}
                width={post.image.dimensions?.width || 1200}
                height={post.image.dimensions?.height || 675}
                priority
                sizes="(max-width: 900px) 100vw, 860px"
              />
            </figure>
          )}
          <div className={styles.content}>
            <PrismicRichText field={post.content} components={components} />
          </div>
          <Link href="/noticias" className={`fv-btn fv-btn--outline ${styles.back}`}>
            <LuArrowLeft size={16} aria-hidden="true" /> Voltar para notícias
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className={`fv-section ${styles.related}`} aria-labelledby="related-title">
          <div className="fv-container">
            <span className="fv-eyebrow">Leia também</span>
            <h2 id="related-title" className="fv-title">
              Mais notícias
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <PostCard key={item.uid} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Cta compact />
    </>
  );
}
