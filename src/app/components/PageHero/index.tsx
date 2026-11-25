import Link from "next/link";
import type { ReactNode } from "react";
import { Decor } from "../Decor";
import { Collage } from "../Collage";
import styles from "./style.module.scss";

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  text?: ReactNode;
  crumbs?: Crumb[];
  image?: { src: string; alt: string; width?: number; height?: number; position?: string };
  /** Arte completa do hero (foto + triângulos do layout) usada como fundo; `ratio` = largura/altura da arte. */
  art?: { src: string; ratio: number; textWidth?: string };
  /** Frase manuscrita sobre a foto (ex.: "Mais pessoas, mais futuro."). */
  script?: string;
  children?: ReactNode;
  compact?: boolean;
};

/** Cabeçalho padrão das páginas internas (breadcrumb, título, texto, foto com triângulos). */
export function PageHero({ eyebrow, title, subtitle, text, crumbs, image, art, script, children, compact }: PageHeroProps) {
  return (
    <section
      className={`${styles.hero} ${compact ? styles.compact : ""} ${image || art ? "" : styles.noImage} ${art ? styles.withArt : ""}`}
      style={
        art
          ? {
              // 1x e 2x: telas de alta densidade (e 4K com zoom) recebem a arte em dobro de resolução
              backgroundImage: `image-set(url(${art.src}) 1x, url(${art.src.replace(/\.jpg$/, "@2x.jpg")}) 2x)`,
              aspectRatio: `${art.ratio}`,
            }
          : undefined
      }
    >
      {image && !art ? <div className={styles.backdrop} aria-hidden="true" /> : null}
      {!image && !art ? <Decor variant="soft" /> : null}
      <div className={`fv-container ${styles.inner}`}>
        <div className={styles.copy} style={art?.textWidth ? { maxWidth: art.textWidth } : undefined}>
          {crumbs && crumbs.length > 0 && (
            <nav className="fv-breadcrumb" aria-label="Você está em">
              <Link href="/">Início</Link>
              {crumbs.map((crumb) => (
                <span key={crumb.label} className={styles.crumb}>
                  <span aria-hidden="true">›</span>
                  {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <strong>{crumb.label}</strong>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <span className="fv-eyebrow">{eyebrow}</span>}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {text && <p className={styles.text}>{text}</p>}
          {children && <div className={styles.actions}>{children}</div>}
        </div>
      </div>
      {art && image && (
        <div className={styles.artMobile}>
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} />
        </div>
      )}
      {image && !art && (
        <div className={styles.visual}>
          <Collage
            variant="hero"
            src={image.src}
            alt={image.alt}
            width={image.width || 760}
            height={image.height || 500}
            priority
            sizes="(max-width: 900px) 100vw, 56vw"
            objectPosition={image.position || "center top"}
          />
          {script && (
            <p className={styles.script} aria-hidden="true">
              {script}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
