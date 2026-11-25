import Image from "next/image";
import styles from "./style.module.scss";

export type CollageVariant = "hero" | "band" | "cta" | "why" | "card";

type Triangle = { points: string; fill: string; opacity?: number };

/**
 * Formas do layout aprovado: a foto é recortada em diagonal e recebe os triângulos
 * verde/laranja/creme por cima. Coordenadas em % (viewBox 100x100 sem preservar proporção),
 * então as formas acompanham o tamanho da caixa em qualquer tela.
 */
const SHAPES: Record<CollageVariant, { clip: string; triangles: Triangle[] }> = {
  hero: {
    clip: "polygon(14% 0, 100% 0, 100% 100%, 0 100%, 0 40%)",
    triangles: [
      { points: "0,0 26,0 13,38", fill: "var(--farvalle-green)" },
      { points: "26,0 40,0 33,20", fill: "var(--farvalle-orange)" },
      { points: "0,100 22,100 11,74", fill: "var(--farvalle-cream)" },
      { points: "100,100 78,100 89,72", fill: "var(--farvalle-orange)" },
      { points: "100,58 100,100 89,72", fill: "var(--farvalle-green)", opacity: 0.92 },
      { points: "100,0 86,0 93,16", fill: "var(--farvalle-cream)" },
    ],
  },
  band: {
    clip: "polygon(24% 0, 100% 0, 100% 100%, 0 100%)",
    triangles: [
      { points: "0,0 42,0 21,44", fill: "var(--farvalle-orange)" },
      { points: "42,0 60,0 51,20", fill: "var(--farvalle-green-hover)" },
      { points: "0,100 30,100 15,62", fill: "var(--farvalle-green-hover)", opacity: 0.9 },
    ],
  },
  cta: {
    clip: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    triangles: [
      { points: "0,0 38,0 19,42", fill: "var(--farvalle-green)" },
      { points: "38,0 60,0 49,24", fill: "var(--farvalle-orange)" },
      { points: "0,100 28,100 14,70", fill: "var(--farvalle-cream)" },
      { points: "100,100 72,100 86,68", fill: "var(--farvalle-orange)" },
      { points: "100,0 80,0 90,20", fill: "var(--farvalle-cream)" },
    ],
  },
  why: {
    clip: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    triangles: [
      { points: "30,0 56,0 43,24", fill: "var(--farvalle-orange)" },
      { points: "56,0 76,0 66,18", fill: "var(--farvalle-green)" },
      { points: "0,100 26,100 13,74", fill: "var(--farvalle-cream)" },
      { points: "100,100 74,100 87,76", fill: "var(--farvalle-green)", opacity: 0.92 },
    ],
  },
  card: {
    clip: "polygon(0 0, 100% 0, 100% 100%, 34% 100%)",
    triangles: [
      { points: "0,0 38,0 19,34", fill: "var(--farvalle-orange)" },
      { points: "38,0 56,0 47,18", fill: "var(--farvalle-green)" },
      { points: "100,100 82,100 91,80", fill: "var(--farvalle-cream)" },
    ],
  },
};

type CollageProps = {
  src: string;
  alt: string;
  variant: CollageVariant;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
  className?: string;
};

export function Collage({
  src,
  alt,
  variant,
  width = 790,
  height = 500,
  sizes = "(max-width: 900px) 100vw, 60vw",
  priority = false,
  objectPosition = "center",
  className = "",
}: CollageProps) {
  const shape = SHAPES[variant];
  const external = src.startsWith("http");

  return (
    <div className={`${styles.collage} ${styles[variant]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized={external}
        className={styles.img}
        style={{ clipPath: shape.clip, objectPosition }}
      />
      <svg className={styles.overlay} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {shape.triangles.map((triangle) => (
          <polygon key={triangle.points} points={triangle.points} fill={triangle.fill} opacity={triangle.opacity ?? 1} />
        ))}
      </svg>
    </div>
  );
}
