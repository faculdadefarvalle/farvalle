import styles from "./style.module.scss";

type DecorProps = {
  /** hero: triângulos grandes atrás da foto; band: faixa escura; corner: canto discreto */
  variant?: "hero" | "band" | "corner" | "soft";
  className?: string;
};

/**
 * Motivo gráfico da identidade (triângulos verde/laranja/creme).
 * Puramente decorativo: fica atrás do conteúdo e não captura cliques.
 */
export function Decor({ variant = "hero", className = "" }: DecorProps) {
  if (variant === "band") {
    return (
      <svg
        className={`${styles.decor} ${className}`}
        viewBox="0 0 1200 320"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <polygon points="0,0 220,0 110,160" fill="#3b5d4a" />
        <polygon points="0,320 180,320 90,170" fill="#3b5d4a" opacity="0.7" />
        <polygon points="1200,0 980,0 1090,180" fill="#e2572b" />
        <polygon points="1200,320 1010,320 1105,170" fill="#3b5d4a" opacity="0.8" />
        <polygon points="880,0 1000,0 940,90" fill="#f6f0ea" opacity="0.18" />
      </svg>
    );
  }

  if (variant === "corner") {
    return (
      <svg
        className={`${styles.decor} ${className}`}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMaxYMin slice"
        aria-hidden="true"
      >
        <polygon points="400,0 200,0 300,160" fill="#e2572b" />
        <polygon points="400,160 300,160 400,300" fill="#2e4a3a" opacity="0.9" />
        <polygon points="120,0 220,0 170,80" fill="#efe4dc" />
      </svg>
    );
  }

  if (variant === "soft") {
    return (
      <svg
        className={`${styles.decor} ${className}`}
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <polygon points="0,0 140,0 70,110" fill="#efe4dc" />
        <polygon points="0,500 160,500 80,360" fill="#efe4dc" />
        <polygon points="1200,500 1040,500 1120,370" fill="#efe4dc" />
        <polygon points="1200,0 1080,0 1140,90" fill="#fbe7dd" />
      </svg>
    );
  }

  // hero
  return (
    <svg
      className={`${styles.decor} ${className}`}
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <polygon points="0,0 150,0 75,120" fill="#efe4dc" />
      <polygon points="0,560 190,560 95,400" fill="#efe4dc" />
      <polygon points="520,0 760,0 640,210" fill="#2e4a3a" />
      <polygon points="760,0 930,0 845,150" fill="#e2572b" />
      <polygon points="640,210 845,150 760,360" fill="#3b5d4a" opacity="0.85" />
      <polygon points="1200,560 980,560 1090,380" fill="#e2572b" />
      <polygon points="1200,320 1200,560 1090,380" fill="#2e4a3a" opacity="0.9" />
      <polygon points="560,560 700,560 630,440" fill="#efe4dc" />
    </svg>
  );
}
