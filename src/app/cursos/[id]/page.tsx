import type { Metadata } from "next";
import type * as prismic from "@prismicio/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuChevronRight, LuMessageCircle } from "react-icons/lu";
import MotivaBolsas from "../../../../public/logo-branca.png";
import { PageHero } from "../../components/PageHero";
import { CourseTabs } from "../../components/CourseTabs";
import { Icon, COURSE_ICON } from "../../components/Icon";
import { Cta } from "../../components/Home/Cta";
import { getCourse } from "../../lib/courses";
import { COURSE_LIST, WHATSAPP_URL } from "../../lib/site-content";
import styles from "./style.module.scss";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) return { title: "Curso" };
  return {
    title: `${course.title} — ${course.meta.degree || "Graduação"}`,
    description: course.description,
  };
}

export default async function CursoPage({ params }: ParamsProps) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  const { meta } = course;
  const whatsapp = `${WHATSAPP_URL.split("&text=")[0]}&text=${encodeURIComponent(
    `Olá! Quero falar com a coordenação do curso de ${course.title} da Farvalle.`
  )}&type=phone_number&app_absent=0`;

  // Quatro dados como no layout aprovado (turno/coordenação: confirmar com a instituição).
  const facts = [
    { icon: "clock", label: "Duração", value: course.semesters },
    { icon: "building", label: "Modalidade", value: course.modality },
    { icon: "calendar", label: "Turno", value: meta.shift },
    { icon: "user", label: "Coordenação", value: meta.coordination },
  ].filter((fact): fact is { icon: string; label: string; value: string } => Boolean(fact.value));

  const highlightsField: prismic.RichTextField = meta.highlights.length
    ? [
        { type: "paragraph", text: `Na Farvalle, o curso de ${course.title} une teoria e prática desde o início, com professores experientes e proximidade com a realidade da região.`, spans: [] },
        ...meta.highlights.map((item) => ({ type: "list-item" as const, text: item, spans: [] })),
      ]
    : [];

  const others = COURSE_LIST.filter((item) => item.uid !== course.uid);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Cursos", href: "/cursos" }, { label: course.title }]}
        title={course.title}
        subtitle={meta.tagline || undefined}
        text={course.description}
        image={{ src: meta.heroImage || meta.image || course.bannerUrl || "", alt: course.bannerAlt || course.title }}
        art={meta.heroArt ? { src: meta.heroArt, ratio: meta.heroArtRatio || 942 / 274, textWidth: "40%" } : undefined}
      >
        <Link href="/matricular" className="fv-btn fv-btn--primary">
          Inscreva-se agora <LuChevronRight size={16} aria-hidden="true" />
        </Link>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="fv-btn fv-btn--outline">
          <LuMessageCircle size={16} aria-hidden="true" /> Falar com a coordenação
        </a>
      </PageHero>

      <section className={styles.facts} aria-label="Dados do curso">
        <ul className={`fv-container ${styles.factsList}`}>
          {facts.map((fact) => (
            <li key={fact.label}>
              <span className="fv-icon-circle">
                <Icon name={fact.icon} size={22} />
              </span>
              <span>
                <small>{fact.label}</small>
                <strong>{fact.value}</strong>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`fv-section ${styles.content}`}>
        <div className={`fv-container ${styles.grid}`}>
          <div className={styles.main}>
            <CourseTabs
              image={{ src: meta.aboutImage || meta.image || course.bannerUrl || "", alt: course.title, position: meta.aboutPosition }}
              tabs={[
                { id: "sobre", label: "Sobre o curso", field: course.sections.about },
                { id: "aprender", label: "O que você vai aprender", field: course.sections.learn },
                { id: "atuacao", label: "Atuação profissional", field: course.sections.market },
                { id: "diferenciais", label: "Diferenciais", field: highlightsField },
                { id: "infra", label: "Infraestrutura", field: course.sections.infrastructure },
              ]}
            />
          </div>

          <aside className={styles.aside}>
            {meta.audience.length > 0 && (
              <div className={`fv-card ${styles.audience}`}>
                <h3>Para quem é este curso?</h3>
                <ul>
                  {meta.audience.map((item) => (
                    <li key={item}>
                      <span className="fv-icon-circle">
                        <Icon name={COURSE_ICON[course.uid] || "graduation"} size={18} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {meta.highlights.length > 0 && (
              <div className={`fv-card ${styles.highlights}`}>
                <h3>Onde você pode atuar</h3>
                <ul>
                  {meta.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={`fv-card ${styles.partner}`}>
              <small>Parceiro de bolsas</small>
              <a
                href={`https://motivabolsas.com.br/farvalle/${course.uid}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Motiva Bolsas — bolsas para este curso"
              >
                <Image src={MotivaBolsas} alt="Motiva Bolsas" height={44} className={styles.partnerLogo} />
              </a>
              <p>Consulte condições especiais de bolsa para este curso.</p>
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className={`fv-section ${styles.others}`} aria-labelledby="outros-title">
          <div className="fv-container">
            <span className="fv-eyebrow">Outros cursos</span>
            <h2 id="outros-title" className="fv-title">
              Conheça também
            </h2>
            <div className={styles.othersGrid}>
              {others.map((item) => (
                <Link key={item.uid} href={`/cursos/${item.uid}`} className={`fv-card ${styles.otherCard}`}>
                  <Image src={item.image} alt={item.name} width={760} height={500} sizes="(max-width: 700px) 100vw, 380px" />
                  <div>
                    <span className="fv-icon-circle">
                      <Icon name={COURSE_ICON[item.uid]} size={20} />
                    </span>
                    <h3>{item.name}</h3>
                    <p>{item.tagline}</p>
                    <span className={styles.otherMore}>
                      Ver curso <LuChevronRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Cta compact />
    </>
  );
}
