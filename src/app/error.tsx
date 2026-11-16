"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LuHouse, LuRefreshCw } from "react-icons/lu";
import { Decor } from "./components/Decor";
import styles from "./not-found.module.scss";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Página de erro inesperado (ex.: CMS indisponível). Nunca mostra detalhes técnicos ao visitante. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={styles.section}>
      <Decor variant="soft" />
      <div className={`fv-container ${styles.inner} ${styles.single}`}>
        <span className="fv-eyebrow">Algo deu errado</span>
        <h1 className="fv-title">Não foi possível carregar esta página</h1>
        <p className="fv-lead">Ocorreu uma instabilidade momentânea. Tente novamente em instantes.</p>
        <div className={styles.actions}>
          <button type="button" onClick={reset} className="fv-btn fv-btn--primary">
            <LuRefreshCw size={16} aria-hidden="true" /> Tentar novamente
          </button>
          <Link href="/" className="fv-btn fv-btn--outline">
            <LuHouse size={16} aria-hidden="true" /> Ir para o início
          </Link>
        </div>
      </div>
    </section>
  );
}
