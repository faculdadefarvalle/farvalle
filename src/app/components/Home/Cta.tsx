import Link from "next/link";
import { LuCheck, LuChevronRight } from "react-icons/lu";
import { Decor } from "../Decor";
import Image from "next/image";
import { Icon } from "../Icon";
import { CTA, CTA_INSCRICAO } from "../../lib/site-content";
import styles from "./Cta.module.scss";

type CtaProps = {
  compact?: boolean;
  /** "icons": versão da página de inscrição (texto + três ganhos com ícones + foto). */
  variant?: "default" | "icons";
};

export function Cta({ compact = false, variant = "default" }: CtaProps) {
  if (variant === "icons") {
    return (
      <section className={`${styles.section} ${styles.compact}`} aria-labelledby="cta-title">
        <Decor variant="soft" />
        <div className={`fv-container ${styles.innerIcons}`}>
          <div className={styles.copy}>
            <h2 id="cta-title" className="fv-title">
              {CTA_INSCRICAO.title}
            </h2>
            <p className="fv-lead">{CTA_INSCRICAO.text}</p>
            <Link href="/cursos" className="fv-btn fv-btn--outline">
              Conheça nossos cursos
            </Link>
          </div>

          <ul className={styles.iconList}>
            {CTA_INSCRICAO.items.map((item) => (
              <li key={item.label}>
                <Icon name={item.icon} size={30} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <div className={styles.photo}>
            <Image src="/images/redesign/insc-cta.jpg" alt="" width={604} height={328} sizes="(max-width: 900px) 0px, 360px" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.section} ${compact ? styles.compact : ""}`} aria-labelledby="cta-title">
      <Decor variant="soft" />
      <div className={`fv-container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="fv-eyebrow">{CTA.eyebrow}</span>
          <h2 id="cta-title" className="fv-title">
            {CTA.title}
          </h2>
          <p className="fv-lead">{CTA.text}</p>
          <div className={styles.actions}>
            <Link href="/matricular" className="fv-btn fv-btn--primary">
              Inscreva-se agora <LuChevronRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/cursos" className="fv-btn fv-btn--outline">
              Conheça nossos cursos
            </Link>
          </div>
        </div>

        <div className={styles.photo}>
          <Image src="/images/redesign/cta.jpg" alt="" width={510} height={308} sizes="(max-width: 900px) 0px, 340px" />
        </div>

        <ul className={styles.checks}>
          {CTA.checks.map((check) => (
            <li key={check}>
              <LuCheck size={16} aria-hidden="true" />
              {check}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
