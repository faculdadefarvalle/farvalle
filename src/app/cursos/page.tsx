import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { PageHero } from "../components/PageHero";
import { Icon } from "../components/Icon";
import { Cta } from "../components/Home/Cta";
import { IconRow } from "../components/IconRow";
import { courseMeta } from "../lib/site-content";
import { getHomeContent } from "../lib/prismic-content";
import { mergeCourseCards } from "../lib/courses";
import styles from "./style.module.scss";

export const metadata: Metadata = {
  title: "Cursos de graduação",
  description:
    "Enfermagem, Fisioterapia e Pedagogia: cursos presenciais da Farvalle em Amargosa/BA, com professores experientes e estrutura completa.",
};

export default async function CursosPage() {
  const content = await getHomeContent();
  const list = mergeCourseCards(content.courses);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Cursos" }]}
        eyebrow="Nossos cursos"
        title={
          <>
            Formação que <em>transforma realidades.</em>
          </>
        }
        text="Cursos presenciais, com professores experientes, estrutura completa e formação voltada para o mercado e para o impacto na sociedade."
        image={{ src: "/images/redesign/hero-estudantes.jpg", alt: "Estudantes da Farvalle", width: 1224, height: 548 }}
        art={{ src: "/images/redesign/hero-bg.jpg", ratio: 942 / 274, textWidth: "34%" }}
      />

      <IconRow />

      <section className={`fv-section ${styles.section}`}>
        <div className={`fv-container ${styles.list}`}>
          {list.map((course, index) => (
            <article key={course.uid} className={`fv-card ${styles.card} ${index % 2 ? styles.reverse : ""}`}>
              <div className={styles.media}>
                <Image
                  src={courseMeta(course.uid)?.heroImage || course.image}
                  alt={course.name}
                  width={662}
                  height={460}
                  sizes="(max-width: 900px) 100vw, 560px"
                  unoptimized={course.image.startsWith("http")}
                />
              </div>
              <div className={styles.body}>
                <span className={`fv-icon-circle ${styles.icon}`}>
                  <Icon name={course.icon} size={24} />
                </span>
                {course.degree && <span className="fv-eyebrow">{course.degree}</span>}
                <h2>{course.name}</h2>
                <p className={styles.tagline}>{course.tagline}</p>
                <p className={styles.summary}>{course.summary}</p>
                <ul className={styles.meta}>
                  <li>{course.semesters}</li>
                  <li>{course.modality}</li>
                  {course.shift && <li>{course.shift}</li>}
                </ul>
                <div className={styles.actions}>
                  <Link href={course.href} className="fv-btn fv-btn--primary">
                    Conhecer o curso <LuChevronRight size={16} aria-hidden="true" />
                  </Link>
                  <Link href="/matricular" className="fv-btn fv-btn--outline">
                    Inscreva-se
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Cta compact />
    </>
  );
}
