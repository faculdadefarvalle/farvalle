import { Decor } from "../Decor";
import { MISSION } from "../../lib/site-content";
import styles from "./Mission.module.scss";

/**
 * Faixa verde institucional entre o hero e os cursos: uma frase sobre educação
 * (direito de todos / desenvolvimento regional), para dar mais cor à home.
 */
export function Mission() {
  return (
    <section className={styles.section} aria-label="Compromisso da Farvalle">
      <Decor variant="band" className={styles.decor} />
      <div className={`fv-container ${styles.inner}`}>
        <span className={`fv-eyebrow ${styles.eyebrow}`}>{MISSION.eyebrow}</span>
        <p className={styles.quote}>
          {MISSION.lead} <strong>{MISSION.accent}</strong> {MISSION.end}
        </p>
      </div>
    </section>
  );
}
