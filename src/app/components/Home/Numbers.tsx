import { Decor } from "../Decor";
import { Icon } from "../Icon";
import Image from "next/image";
import { NUMBERS } from "../../lib/site-content";
import styles from "./Numbers.module.scss";

export function Numbers() {
  return (
    <section className={styles.section} aria-labelledby="numbers-title">
      <Decor variant="band" />
      <div className={`fv-container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={`fv-eyebrow ${styles.eyebrow}`}>{NUMBERS.eyebrow}</span>
          <h2 id="numbers-title" className={styles.title}>
            {NUMBERS.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </div>

        <ul className={styles.list}>
          {NUMBERS.items.map((item) => (
            <li key={item.label}>
              <Icon name={item.icon} size={30} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

      </div>

      <div className={styles.photo}>
        <Image src="/images/redesign/band.jpg" alt="" width={504} height={284} sizes="(max-width: 1100px) 0px, 28vw" />
      </div>
    </section>
  );
}
