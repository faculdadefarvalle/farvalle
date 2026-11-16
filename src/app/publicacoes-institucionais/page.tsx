import type { Metadata } from "next";
import Link from "next/link";
import * as prismic from "@prismicio/client";
import { LuBookOpen, LuCalendarDays, LuDownload, LuFileText, LuMessageCircle } from "react-icons/lu";
import { PageHero } from "../components/PageHero";
import { Cta } from "../components/Home/Cta";
import { getClient } from "../services/prismic";
import { WHATSAPP_URL } from "../lib/site-content";
import styles from "./style.module.scss";

export const metadata: Metadata = {
  title: "Publicações institucionais",
  description: "Calendário acadêmico, regulamentos e documentos institucionais da Farvalle.",
};

export const revalidate = 300;

type Publication = {
  id: string;
  title: string;
  text: string;
  icon: typeof LuCalendarDays;
  file?: { url: string; name: string };
};

async function getPublications(): Promise<Publication[]> {
  let calendario: prismic.FilledLinkToMediaField | undefined;
  let regulamento: prismic.FilledLinkToMediaField | undefined;

  try {
    const client = getClient();
    const document = await client.getByUID("arquivos", "publicacoes-institucionais");
    if (prismic.isFilled.linkToMedia(document.data.calendario_academico)) {
      calendario = document.data.calendario_academico;
    }
    if (prismic.isFilled.linkToMedia(document.data.regulamento_institucional)) {
      regulamento = document.data.regulamento_institucional;
    }
  } catch {
    // Sem acesso ao CMS: mostra os cartões sem arquivo
  }

  return [
    {
      id: "calendario",
      title: "Calendário Acadêmico",
      text: "Datas, períodos letivos, feriados e prazos importantes do ano letivo.",
      icon: LuCalendarDays,
      file: calendario ? { url: calendario.url, name: calendario.name } : undefined,
    },
    {
      id: "regulamentos",
      title: "Regulamentos Institucionais",
      text: "Documentos, normas e orientações que organizam a vida acadêmica na Farvalle.",
      icon: LuBookOpen,
      file: regulamento ? { url: regulamento.url, name: regulamento.name } : undefined,
    },
  ];
}

export default async function PublicacoesInstitucionaisPage() {
  const publications = await getPublications();

  return (
    <>
      <PageHero
        crumbs={[{ label: "Publicações institucionais" }]}
        eyebrow="Publicações"
        title={
          <>
            Conteúdos que ampliam <em>conhecimento e oportunidades.</em>
          </>
        }
        text="Acesse nossos materiais, documentos e informações institucionais."
        compact
      />

      <section className={`fv-section ${styles.section}`}>
        <div className={`fv-container ${styles.grid}`}>
          {publications.map((publication) => (
            <article key={publication.id} id={publication.id} className={`fv-card ${styles.card}`}>
              <span className="fv-icon-circle">
                <publication.icon size={24} aria-hidden="true" />
              </span>
              <h2>{publication.title}</h2>
              <p>{publication.text}</p>
              {publication.file ? (
                <a href={publication.file.url} target="_blank" rel="noopener noreferrer" className={styles.file}>
                  <LuFileText size={18} aria-hidden="true" />
                  <span>
                    <strong>{publication.file.name}</strong>
                    <small>Abrir documento (PDF)</small>
                  </span>
                  <LuDownload size={18} aria-hidden="true" />
                </a>
              ) : (
                <span className={styles.empty}>Documento em atualização. Em breve disponível para download.</span>
              )}
            </article>
          ))}

          <article className={`fv-card ${styles.card} ${styles.cardGreen}`}>
            <span className="fv-icon-circle">
              <LuMessageCircle size={24} aria-hidden="true" />
            </span>
            <h2>Precisa de outro documento?</h2>
            <p>Declarações, históricos e demais solicitações podem ser feitas diretamente com a secretaria acadêmica.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="fv-btn fv-btn--light">
              Falar com a secretaria
            </a>
            <Link href="/contato" className={styles.link}>
              Ou use o formulário de contato
            </Link>
          </article>
        </div>
      </section>

      <Cta compact />
    </>
  );
}
