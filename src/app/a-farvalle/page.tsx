import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { LuChevronRight, LuMapPin } from "react-icons/lu";
import { PageHero } from "../components/PageHero";
import { Icon } from "../components/Icon";
import { Numbers } from "../components/Home/Numbers";
import { Cta } from "../components/Home/Cta";
import { AboutBanner } from "../components/AboutBanner";
import { IconRow } from "../components/IconRow";
import { getClient } from "../services/prismic";
import { ABOUT } from "../lib/site-content";
import styles from "./style.module.scss";

export const metadata: Metadata = {
  title: "A Farvalle",
  description:
    "Conheça a Faculdade Regional do Valle: história, valores e um campus no coração de Amargosa e do Recôncavo Baiano.",
};

/** Texto institucional editável no Prismic (post "sobre"); cai no texto padrão se não existir. */
async function getAboutRichText(): Promise<prismic.RichTextField | null> {
  try {
    const client = getClient();
    const document = await client.getByUID("posts", "sobre");
    return prismic.isFilled.richText(document.data.content) ? document.data.content : null;
  } catch {
    return null;
  }
}

const richComponents = {
  heading1: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
  heading2: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
  heading3: ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>,
  paragraph: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
};

const valueIcons = ["graduation", "user", "building", "handshake", "care"];

export default async function AFarvallePage() {
  const richText = await getAboutRichText();
  // Foto real de turma da Farvalle (arte do site); a do Prismic é vertical e não encaixa no quadro
  const building = "/images/redesign/predio.jpg";

  return (
    <>
      <PageHero
        crumbs={[{ label: "A Farvalle" }]}
        eyebrow={ABOUT.eyebrow}
        title={
          <>
            {ABOUT.title} <em>{ABOUT.accent}</em>
          </>
        }
        text={ABOUT.intro}
        image={{ src: "/images/redesign/hero-estudantes.jpg", alt: "Estudantes da Farvalle", width: 1224, height: 548 }}
        art={{ src: "/images/redesign/hero-bg.jpg", ratio: 942 / 274, textWidth: "34%" }}
      >
        <Link href="/cursos" className="fv-btn fv-btn--primary">
          Conheça nossos cursos <LuChevronRight size={16} aria-hidden="true" />
        </Link>
        <Link href="/contato" className="fv-btn fv-btn--outline">
          Fale com a gente
        </Link>
      </PageHero>

      <IconRow />
      <AboutBanner href="/cursos" label="Conheça nossos cursos" />

      <section className={`fv-section ${styles.history}`}>
        <div className={`fv-container ${styles.historyInner}`}>
          <div className={styles.historyCopy}>
            <span className="fv-eyebrow">Nossa história</span>
            <h2 className="fv-title">
              No coração de Amargosa <em>e do Recôncavo Baiano.</em>
            </h2>
            <div className={styles.rich}>
              {richText ? (
                <PrismicRichText field={richText} components={richComponents} />
              ) : (
                <>
                  <p>{ABOUT.history}</p>
                  <p>{ABOUT.presencial}</p>
                </>
              )}
            </div>
          </div>
          <aside className={`fv-card ${styles.campus}`}>
            <Image src={building} alt="" width={968} height={1010} sizes="(max-width: 900px) 100vw, 380px" />
            <div>
              <span className="fv-icon-circle">
                <LuMapPin size={20} aria-hidden="true" />
              </span>
              <strong>Campus Valle Shopping</strong>
              <p>Avenida Dr. Luís Sande, 147, Santa Rita — Amargosa/BA. Aulas 100% presenciais, pertinho de você.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className={`fv-section ${styles.values}`} aria-labelledby="valores-title">
        <div className="fv-container">
          <span className="fv-eyebrow">Por que escolher a Farvalle</span>
          <h2 id="valores-title" className="fv-title">
            Educação que gera oportunidades <em>para a nossa gente e para o território.</em>
          </h2>
          <ul className={styles.valuesGrid}>
            {ABOUT.values.map((value, index) => (
              <li key={value.title} className="fv-card">
                <span className="fv-icon-circle">
                  <Icon name={valueIcons[index % valueIcons.length]} size={22} />
                </span>
                <strong>{value.title}</strong>
                <p>{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Numbers />
      <Cta compact />
    </>
  );
}
