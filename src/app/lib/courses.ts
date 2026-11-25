import * as prismic from "@prismicio/client";
import { getClient } from "../services/prismic";
import type { HomeCourse } from "./prismic-content";
import { courseMeta, COURSE_LIST, type CourseMeta } from "./site-content";
import { COURSE_ICON } from "../components/Icon";

/** Card de curso usado na home e em /cursos (Prismic + textos do layout). */
export type CourseCard = {
  uid: string;
  href: string;
  name: string;
  degree: string;
  tagline: string;
  summary: string;
  semesters: string;
  modality: string;
  shift?: string;
  image: string;
  imageAlt: string;
  icon: string;
};

/** Normaliza "10" ou "10 semestres" para "10 semestres". */
export function formatSemesters(raw: string | null | undefined, fallback = "") {
  const digits = (raw || "").replace(/\D/g, "");
  return digits ? `${digits} semestres` : raw || fallback;
}

/**
 * Une os cursos do Prismic (título, semestres, modalidade, imagem) com os textos do layout.
 * Sem Prismic, usa só o conteúdo local. Imagem do layout tem prioridade para os cursos conhecidos.
 */
export function mergeCourseCards(courses: HomeCourse[]): CourseCard[] {
  if (!courses.length) {
    return COURSE_LIST.map((meta) => ({
      uid: meta.uid,
      href: `/cursos/${meta.uid}`,
      name: meta.name,
      degree: meta.degree,
      tagline: meta.tagline,
      summary: meta.summary,
      semesters: meta.semesters,
      modality: meta.modality,
      shift: meta.shift,
      image: meta.image,
      imageAlt: meta.name,
      icon: COURSE_ICON[meta.uid] || "graduation",
    }));
  }

  return courses.map((course) => {
    const uid = course.url.split("/").pop() || course.id;
    const meta = courseMeta(uid);
    return {
      uid,
      href: course.url,
      name: meta?.name || course.title,
      degree: meta?.degree || "",
      tagline: meta?.tagline || "",
      summary: meta?.summary || "",
      semesters: formatSemesters(course.semesters, meta?.semesters || ""),
      modality: course.modality || meta?.modality || "Presencial",
      shift: meta?.shift,
      image: meta?.image || course.imageUrl,
      imageAlt: course.imageAlt || meta?.name || course.title,
      icon: COURSE_ICON[uid] || "graduation",
    };
  });
}

export type CourseContent = {
  uid: string;
  meta: CourseMeta;
  title: string;
  description: string;
  semesters: string;
  modality: string;
  bannerUrl?: string;
  bannerAlt?: string;
  sections: {
    about: prismic.RichTextField;
    learn: prismic.RichTextField;
    market: prismic.RichTextField;
    infrastructure: prismic.RichTextField;
  };
  fromPrismic: boolean;
};

const empty: prismic.RichTextField = [];

const fallbackContent = (meta: CourseMeta): CourseContent => ({
  uid: meta.uid,
  meta,
  title: meta.name,
  description: meta.summary,
  semesters: meta.semesters,
  modality: meta.modality,
  sections: {
    about: (meta.about || meta.summary).split("\n\n").map((text) => ({ type: "paragraph" as const, text, spans: [] })) as unknown as prismic.RichTextField,
    learn: empty,
    market: empty,
    infrastructure: empty,
  },
  fromPrismic: false,
});

/** Conteúdo do curso: Prismic quando disponível, com os textos do layout como base. */
export async function getCourse(uid: string): Promise<CourseContent | null> {
  const meta = courseMeta(uid);

  try {
    const client = getClient();
    const document = await client.getByUID("courses", uid);
    const data = document.data;
    const base: CourseMeta = meta || {
      uid: uid as CourseMeta["uid"],
      name: data.curso || uid,
      degree: "",
      tagline: "",
      summary: data.descricao || "",
      semesters: formatSemesters(data.semestres),
      modality: data.modalidade || "Presencial",
      about: data.descricao || "",
      image: prismic.isFilled.image(data.banner) ? data.banner.url : "/images/redesign/curso-enfermagem.jpg",
      audience: [],
      highlights: [],
    };

    return {
      uid,
      meta: base,
      title: base.name || data.curso || uid,
      description: data.descricao || base.summary,
      semesters: formatSemesters(data.semestres, base.semesters),
      modality: data.modalidade || base.modality,
      bannerUrl: prismic.isFilled.image(data.banner) ? data.banner.url : undefined,
      bannerAlt: prismic.isFilled.image(data.banner) ? data.banner.alt || base.name : undefined,
      sections: {
        about: prismic.isFilled.richText(data.descricao_extensa) ? data.descricao_extensa : fallbackContent(base).sections.about,
        learn: prismic.isFilled.richText(data.disiplinas) ? data.disiplinas : empty,
        market: prismic.isFilled.richText(data.mercado_de_trabalho) ? data.mercado_de_trabalho : empty,
        infrastructure: prismic.isFilled.richText(data.infraestrutura) ? data.infraestrutura : empty,
      },
      fromPrismic: true,
    };
  } catch (error) {
    // Documento inexistente no CMS → 404 (a menos que seja um dos cursos do layout).
    if (error instanceof prismic.NotFoundError) {
      return meta ? fallbackContent(meta) : null;
    }
    // Falha de rede/configuração: não cacheia um 404 indevido; usa o conteúdo local se houver.
    console.error("[courses] Falha ao consultar o Prismic:", error);
    if (meta) return fallbackContent(meta);
    throw error;
  }
}

export async function getCourseUids(): Promise<string[]> {
  try {
    const client = getClient();
    const documents = await client.getAllByType("courses");
    const uids = documents.map((document) => document.uid).filter(Boolean) as string[];
    return uids.length ? uids : COURSE_LIST.map((course) => course.uid);
  } catch {
    return COURSE_LIST.map((course) => course.uid);
  }
}
