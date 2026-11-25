import type { Metadata } from "next";
import { PageHero } from "../components/PageHero";
import { InscricaoForm } from "../components/Inscricao/InscricaoForm";
import { Cta } from "../components/Home/Cta";
import styles from "./style.module.scss";
import { VESTIBULAR_EDITION } from "../lib/site-content";

export const metadata: Metadata = {
  title: `Inscrição — ${VESTIBULAR_EDITION}`,
  description:
    `Inscreva-se no ${VESTIBULAR_EDITION} da Farvalle: Enfermagem, Fisioterapia e Pedagogia. Vestibular online, nota do ENEM, transferência externa ou segunda graduação.`,
};

export default function MatricularPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Vestibular", href: "/matricular" }, { label: "Inscrição" }]}
        eyebrow={VESTIBULAR_EDITION}
        title={
          <>
            Inscrição
            <br />
            <em>{VESTIBULAR_EDITION}</em>
          </>
        }
        subtitle="Dê o próximo passo para estudar na Farvalle."
        text="Mais que uma inscrição, é o início de uma nova história. Escolha o seu curso, compartilhe seus talentos e venha construir um futuro com mais oportunidades."
        image={{ src: "/images/redesign/insc-hero.jpg", alt: "Estudante da Farvalle", width: 974, height: 596 }}
        art={{ src: "/images/redesign/insc-hero-bg.jpg", ratio: 942 / 298, textWidth: "40%" }}
      />
      <section className={`fv-section ${styles.section}`}>
        <div className="fv-container">
          <InscricaoForm />
        </div>
      </section>
      <Cta variant="icons" />
    </>
  );
}
