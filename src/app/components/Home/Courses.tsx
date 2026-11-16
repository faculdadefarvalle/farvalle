import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { Icon } from "../Icon";
import Image from "next/image";
import { mergeCourseCards } from "../../lib/courses";
import { courseMeta } from "../../lib/site-content";
import { MobileCarousel } from "../MobileCarousel";
import type { HomeCourse } from "../../lib/prismic-content";
import styles from "./Courses.module.scss";

type CoursesProps = {
  courses: HomeCourse[];
};

export function Courses({ courses }: CoursesProps) {
  const list = mergeCourseCards(courses);

  return (
    <section id="cursos" className={`fv-section ${styles.section}`} aria-labelledby="cursos-title">
      <div className="fv-container">
        <div className={styles.head}>
          <div>
            <span className="fv-eyebrow">Nossos cursos</span>
            <h2 id="cursos-title" className="fv-title">
              Formação que <em>transforma realidades.</em>
            </h2>
          </div>
          <p className="fv-lead">
            Cursos presenciais, com professores experientes, estrutura completa e formação voltada para o mercado e para o
            impacto na sociedade.
          </p>
          <Link href="/cursos" className={`fv-btn fv-btn--outline ${styles.all}`}>
            Ver todos os cursos <LuChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Desktop: grade de três cards */}
        <div className={styles.grid}>
          {list.map((course) => (
            <Link href={course.href} key={course.uid} className={`fv-card ${styles.card}`}>
              <div className={styles.cardBody}>
                <span className={`fv-icon-circle ${styles.icon}`}>
                  <Icon name={course.icon} size={24} />
                </span>
                <h3>{course.name}</h3>
                <p>{course.tagline}</p>
                <div className={styles.meta}>
                  <span>{course.semesters}</span>
                  <i />
                  <span>{course.modality}</span>
                  <LuChevronRight size={14} className={styles.arrow} aria-hidden="true" />
                </div>
              </div>
              <div className={styles.cardImage}>
                <Image src={course.image} alt={course.imageAlt} width={465} height={402} sizes="(max-width: 700px) 100vw, 220px" unoptimized={course.image.startsWith("http")} className={styles.imgDesktop} />
                {/* No celular a foto ocupa a largura toda: usa a arte do hero do curso */}
                <Image src={courseMeta(course.uid)?.heroImage || course.image} alt="" width={662} height={460} sizes="100vw" unoptimized={course.image.startsWith("http")} className={styles.imgMobile} />
              </div>
            </Link>
          ))}
        </div>

        {/* Celular: um card por vez, passando sozinho (a grade acima fica oculta) */}
        <div className={styles.mobile}>
          <MobileCarousel label="Nossos cursos">
            {list.map((course) => (
            <Link href={course.href} key={course.uid} className={`fv-card ${styles.card}`}>
              <div className={styles.cardBody}>
                <span className={`fv-icon-circle ${styles.icon}`}>
                  <Icon name={course.icon} size={24} />
                </span>
                <h3>{course.name}</h3>
                <p>{course.tagline}</p>
                <div className={styles.meta}>
                  <span>{course.semesters}</span>
                  <i />
                  <span>{course.modality}</span>
                  <LuChevronRight size={14} className={styles.arrow} aria-hidden="true" />
                </div>
              </div>
              <div className={styles.cardImage}>
                <Image src={course.image} alt={course.imageAlt} width={465} height={402} sizes="(max-width: 700px) 100vw, 220px" unoptimized={course.image.startsWith("http")} className={styles.imgDesktop} />
                {/* No celular a foto ocupa a largura toda: usa a arte do hero do curso */}
                <Image src={courseMeta(course.uid)?.heroImage || course.image} alt="" width={662} height={460} sizes="100vw" unoptimized={course.image.startsWith("http")} className={styles.imgMobile} />
              </div>
            </Link>
          ))}
          </MobileCarousel>
          {/* Regra (celular): o botão "ver todos" vem depois do slideshow */}
          <Link href="/cursos" className={`fv-btn fv-btn--outline ${styles.allMobile}`}>
            Ver todos os cursos <LuChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
