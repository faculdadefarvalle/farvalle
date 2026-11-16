import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { Icon } from "../Icon";
import { PUBLICATIONS } from "../../lib/site-content";
import styles from "./Publications.module.scss";

export function Publications() {
  return (
    <section className={`fv-section ${styles.section}`} aria-labelledby="pub-title">
      <div className={`fv-container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="fv-eyebrow">{PUBLICATIONS.eyebrow}</span>
          <h2 id="pub-title" className="fv-title">
            {PUBLICATIONS.title} <em>{PUBLICATIONS.accent}</em>
          </h2>
          <p className="fv-lead">{PUBLICATIONS.text}</p>
        </div>
        <div className={styles.grid}>
          {PUBLICATIONS.items.map((item) => (
            <Link href={item.href} key={item.title} className={`fv-card ${styles.card}`}>
              <span className="fv-icon-circle">
                <Icon name={item.icon} size={22} />
              </span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
              <span className={styles.more}>
                Acessar <LuArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
