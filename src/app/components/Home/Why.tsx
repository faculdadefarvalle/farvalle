import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { Icon } from "../Icon";
import Image from "next/image";
import { WHY } from "../../lib/site-content";
import styles from "./Why.module.scss";

type WhyProps = {
  image?: { url: string; alt: string; width: number; height: number };
};

export function Why({ image }: WhyProps) {
  return (
    <section className={`fv-section ${styles.section}`} aria-labelledby="why-title">
      <div className={`fv-container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="fv-eyebrow">{WHY.eyebrow}</span>
          <h2 id="why-title" className="fv-title">
            {WHY.title}
            <br />
            <em>{WHY.accent}</em>
          </h2>
          <p className="fv-lead">{WHY.text}</p>
          <Link href="/a-farvalle" className="fv-btn fv-btn--primary">
            Conheça a Farvalle <LuChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.photoWrap}>
          <Image
            src="/images/redesign/predio.jpg"
            alt={image?.alt || "Turma da Farvalle em sala de aula, no campus do Valle Shopping, em Amargosa"}
            width={700}
            height={480}
            sizes="(max-width: 900px) 100vw, 520px"
          />
        </div>

        <ul className={styles.list}>
          {WHY.items.map((item) => (
            <li key={item.label}>
              <span className="fv-icon-circle">
                <Icon name={item.icon} size={22} />
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
