import Link from "next/link";
import { LuChevronRight, LuHouse, LuMessageCircle } from "react-icons/lu";
import { Decor } from "./components/Decor";
import { WHATSAPP_URL } from "./lib/site-content";
import styles from "./not-found.module.scss";

const QUICK_LINKS = [
  { href: "/", label: "Início" },
  { href: "/cursos", label: "Cursos" },
  { href: "/matricular", label: "Vestibular" },
  { href: "/noticias", label: "Notícias" },
  { href: "/publicacoes-institucionais", label: "Publicações" },
  { href: "/contato", label: "Contato" },
];

/** Página 404 no layout do site: código grande, explicação, atalhos e contato. */
export default function NotFound() {
  return (
    <section className={styles.section}>
      <Decor variant="soft" />
      <div className={`fv-container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="fv-eyebrow">Erro 404</span>
          <p className={styles.code} aria-hidden="true">
            404
          </p>
          <h1 className="fv-title">
            Página <em>não encontrada.</em>
          </h1>
          <p className="fv-lead">
            O endereço que você acessou não existe, foi movido ou está com algum erro de digitação. Use os atalhos ao lado
            para continuar navegando.
          </p>
          <div className={styles.actions}>
            <Link href="/" className="fv-btn fv-btn--primary">
              <LuHouse size={14} aria-hidden="true" /> Ir para o início
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="fv-btn fv-btn--outline">
              <LuMessageCircle size={14} aria-hidden="true" /> Falar com a gente
            </a>
          </div>
        </div>

        <nav className={`fv-card ${styles.links}`} aria-label="Atalhos">
          <strong>Para onde você quer ir?</strong>
          <ul>
            {QUICK_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  {item.label} <LuChevronRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
