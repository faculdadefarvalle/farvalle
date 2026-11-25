import type { Metadata } from "next";
import Link from "next/link";
import { LuChevronRight, LuCircleCheck, LuMessageCircle } from "react-icons/lu";
import { Decor } from "../components/Decor";
import { VESTIBULAR_EDITION, WHATSAPP_DISPLAY, WHATSAPP_URL } from "../lib/site-content";
import styles from "./style.module.scss";

export const metadata: Metadata = {
  title: "Inscrição enviada",
  robots: { index: false },
};

export default function InscricaoEnviadaPage() {
  return (
    <section className={styles.section}>
      <Decor variant="soft" />
      <div className={`fv-container ${styles.inner}`}>
        <div className={`fv-card ${styles.card}`}>
          <span className={styles.icon}>
            <LuCircleCheck size={44} aria-hidden="true" />
          </span>
          <span className="fv-eyebrow">{VESTIBULAR_EDITION}</span>
          <h1>Sua inscrição foi enviada!</h1>
          <p>
            Recebemos seus dados. Em breve, você receberá por e-mail o resultado da análise da sua inscrição (e da
            redação, no caso do vestibular online), em que poderá verificar se está apto(a) a prosseguir com a matrícula.
          </p>
          <p className={styles.small}>Fique de olho também na caixa de spam e no seu WhatsApp.</p>
          <div className={styles.actions}>
            <Link href="/" className="fv-btn fv-btn--primary">
              Voltar ao início <LuChevronRight size={16} aria-hidden="true" />
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="fv-btn fv-btn--outline">
              <LuMessageCircle size={16} aria-hidden="true" /> Falar no WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
