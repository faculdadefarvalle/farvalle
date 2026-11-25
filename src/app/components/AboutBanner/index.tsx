import Image from "next/image";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import logoWhite from "../../../../public/farvalle-logo-white.png";
import styles from "./style.module.scss";

type AboutBannerProps = {
  /** Destino do botão (na própria página A Farvalle aponta para os cursos). */
  href?: string;
  label?: string;
};

/** Faixa do layout aprovado: campus no Valle Shopping com os triângulos, texto nos dois lados. */
export function AboutBanner({ href = "/a-farvalle", label = "Conheça a Farvalle" }: AboutBannerProps) {
  return (
    <section className={styles.banner} aria-labelledby="about-banner-title">
      <div className={`fv-container ${styles.inner}`}>
        <div className={styles.left}>
          <Image src={logoWhite} alt="Farvalle — Faculdade Regional do Valle" width={170} height={44} className={styles.logo} />
          <h2 id="about-banner-title">
            No coração de Amargosa
            <br />e do Recôncavo Baiano.
          </h2>
          <p>Educação que gera oportunidades para a nossa gente e para o território.</p>
        </div>
        <div className={styles.right}>
          <h3>
            Mais que
            <br />
            uma faculdade,
            <br />
            <em>
              parte da nossa
              <br />
              história.
            </em>
          </h3>
          <p>A Farvalle acredita no potencial das pessoas e no desenvolvimento da nossa região.</p>
          <Link href={href} className="fv-btn fv-btn--primary">
            {label} <LuChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
