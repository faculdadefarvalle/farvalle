import Link from "next/link";
import { Icon, COURSE_ICON } from "../Icon";
import { COURSE_LIST } from "../../lib/site-content";
import styles from "./style.module.scss";

const QUALITIES = [
  { icon: "graduation", label: "Formação de qualidade" },
  { icon: "people", label: "Professores experientes" },
  { icon: "building", label: "Estrutura completa" },
  { icon: "community", label: "Conexão com o mercado" },
  { icon: "idea", label: "Acolhimento e oportunidades" },
];

/** Faixa de ícones do layout aprovado: os três cursos à esquerda e os diferenciais à direita. */
export function IconRow() {
  return (
    <section className={styles.row} aria-label="Cursos e diferenciais">
      <div className={`fv-container ${styles.inner}`}>
        <ul className={styles.courses}>
          {COURSE_LIST.map((course) => (
            <li key={course.uid}>
              <Link href={`/cursos/${course.uid}`}>
                <span className={`fv-icon-circle ${styles.circle}`}>
                  <Icon name={COURSE_ICON[course.uid] || "graduation"} size={26} />
                </span>
                <strong>{course.name}</strong>
              </Link>
            </li>
          ))}
        </ul>
        <ul className={styles.qualities}>
          {QUALITIES.map((item) => (
            <li key={item.label}>
              <Icon name={item.icon} size={26} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
