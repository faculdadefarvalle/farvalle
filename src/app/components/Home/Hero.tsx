import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { HERO, HERO_SLIDES } from "../../lib/site-content";
import { HeroSlider } from "../HeroSlider";
import styles from "./Hero.module.scss";

type HeroProps = {
  image?: { url: string; alt: string; width: number; height: number };
};

/**
 * Hero da home, fiel ao layout aprovado: composição fotográfica com triângulos
 * (arte do layout) como fundo e o texto/botões em HTML por cima.
 */
export function Hero({ image }: HeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`fv-container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="fv-eyebrow">{HERO.eyebrow}</span>
          <h1 id="hero-title" className={styles.title}>
            {/* Quebras do layout (desktop) */}
            <span className={styles.desktopLines}>
              {HERO.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <span>
                {HERO.accentLead} <em>{HERO.accent}</em>
              </span>
              <em>{HERO.accentEnd}</em>
            </span>
            {/* Celular: três linhas justificadas ocupando a largura toda */}
            <span className={styles.mobileLines}>
              {HERO.titleMobile.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <span>
                {HERO.titleMobileLast} <em>{HERO.accent} {HERO.accentEnd}</em>
              </span>
            </span>
          </h1>
          <p className={styles.text}>{HERO.text}</p>
          <p className={styles.textShort}>{HERO.textShort}</p>
          <div className={styles.actions}>
            <Link href="/matricular" className="fv-btn fv-btn--primary">
              Inscreva-se agora <LuChevronRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/cursos" className={`fv-btn fv-btn--outline ${styles.secondary}`}>
              Conheça nossos cursos
            </Link>
          </div>
        </div>
      </div>

      {/* Versão estreita (celular): carrossel de fotos abaixo do texto */}
      <div className={styles.mobilePhoto}>
        <HeroSlider slides={image?.url ? [{ src: image.url, alt: image.alt }, ...HERO_SLIDES] : HERO_SLIDES} />
      </div>
    </section>
  );
}
