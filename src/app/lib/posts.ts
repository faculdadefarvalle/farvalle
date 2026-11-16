import * as prismic from "@prismicio/client";
import type { PostsDocument } from "../../../prismicio-types";
import { getClient } from "../services/prismic";
import previewDocs from "./preview-posts.json";

const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW_SAMPLES === "1";

/**
 * Prévia sem acesso ao Prismic: as matérias publicadas no site atual (cópia de
 * preview-posts.json) com as imagens servidas de /public/images/posts/<id>.jpg.
 * Só entra quando NEXT_PUBLIC_PREVIEW_SAMPLES=1 e o CMS não responde.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localImage = (img: any) => (img && img.id ? { ...img, url: `/images/posts/${img.id}.jpg` } : img);

function previewPosts(): PostsDocument[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (previewDocs as any[])
    .map((doc) => ({
      ...doc,
      data: {
        ...doc.data,
        image: localImage(doc.data.image),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: doc.data.content.map((block: any) => (block.type === "image" ? localImage(block) : block)),
      },
    }))
    .sort((a, b) => (a.first_publication_date < b.first_publication_date ? 1 : -1)) as PostsDocument[];
}

export type PostSummary = {
  uid: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  imageAlt: string;
  date: string;
  dateLabel: string;
  author?: string;
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(iso))
    .replace(".", "")
    .toUpperCase();

export function postSummaryFromDocument(document: PostsDocument): PostSummary {
  const text = prismic.asText(document.data?.content as prismic.RichTextField) || "";
  const excerpt = text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text;
  const image = prismic.isFilled.image(document.data?.image) ? document.data.image : undefined;
  const iso = document.first_publication_date || document.last_publication_date || new Date().toISOString();

  return {
    uid: document.uid,
    title: document.data?.title || "Notícia",
    excerpt,
    imageUrl: image?.url || undefined,
    imageAlt: image?.alt || document.data?.title || "",
    date: iso,
    dateLabel: formatDate(iso),
    author: document.data?.author || undefined,
  };
}

/** Últimas notícias (posts do Prismic). Nunca lança: em falha devolve lista vazia. */
export async function getLatestPosts(limit = 3, excludeUid?: string): Promise<PostSummary[]> {
  try {
    const client = getClient();
    const response = await client.getAllByType("posts", {
      pageSize: limit + 1,
      limit: limit + 1,
      orderings: { field: "document.first_publication_date", direction: "desc" },
    });

    return response
      .filter((post) => post.uid !== excludeUid && post.uid !== "sobre")
      .slice(0, limit)
      .map(postSummaryFromDocument);
  } catch {
    if (PREVIEW) {
      return previewPosts()
        .filter((post) => post.uid !== excludeUid)
        .slice(0, limit)
        .map(postSummaryFromDocument);
    }
    return [];
  }
}

/** Todas as notícias para a listagem. */
export async function getAllPosts(): Promise<PostSummary[]> {
  try {
    const client = getClient();
    const response = await client.getAllByType("posts", {
      orderings: { field: "document.first_publication_date", direction: "desc" },
    });
    return response.filter((post) => post.uid !== "sobre").map(postSummaryFromDocument);
  } catch {
    if (PREVIEW) return previewPosts().map(postSummaryFromDocument);
    return [];
  }
}

/**
 * Uma notícia pelo uid. `null` só quando o documento não existe no CMS;
 * falha de rede/configuração é relançada para não cachear um 404 indevido.
 */
export async function getPost(uid: string): Promise<PostsDocument | null> {
  try {
    const client = getClient();
    return await client.getByUID("posts", uid);
  } catch (error) {
    if (error instanceof prismic.NotFoundError) return null;
    if (PREVIEW) return previewPosts().find((post) => post.uid === uid) || null;
    console.error("[posts] Falha ao consultar o Prismic:", error);
    throw error;
  }
}

/**
 * Amostras do layout aprovado, usadas SOMENTE na prévia (NEXT_PUBLIC_PREVIEW_SAMPLES=1)
 * quando o CMS não responde. Em produção as notícias vêm sempre do Prismic.
 */
export const SAMPLE_POSTS: PostSummary[] = [
  { uid: "", title: "Farvalle promove semana acadêmica com foco em inovação", excerpt: "Evento reuniu profissionais e estudantes para discutir os desafios do futuro.", imageUrl: "/images/redesign/news-1.jpg", imageAlt: "", date: "2024-04-12", dateLabel: "12 ABR 2024" },
  { uid: "", title: "Novos laboratórios ampliam estrutura para os cursos da saúde", excerpt: "Investimento reforça o compromisso com a qualidade da formação.", imageUrl: "/images/redesign/news-2.jpg", imageAlt: "", date: "2024-03-26", dateLabel: "26 MAR 2024" },
  { uid: "", title: "Projetos de extensão fortalecem a comunidade local", excerpt: "Ações da Farvalle geram impacto social e novas oportunidades na região.", imageUrl: "/images/redesign/news-3.jpg", imageAlt: "", date: "2024-03-10", dateLabel: "10 MAR 2024" },
];

