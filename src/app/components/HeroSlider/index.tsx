"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

export type Slide = { src: string; alt: string; caption?: string };

type HeroSliderProps = {
  slides: Slide[];
  /** Intervalo da troca automática (ms). */
  interval?: number;
};

/**
 * Carrossel de fotos da versão mobile da home: troca automática com transição suave,
 * arrasto com o dedo, bolinhas de navegação e pausa quando a aba está oculta.
 * Respeita "reduzir movimento" (sem troca automática).
 */
export function HeroSlider({ slides, interval = 4500 }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((current) => (current + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [count, interval, paused]);

  function go(next: number) {
    setIndex(((next % count) + count) % count);
  }

  return (
    <div
      className={styles.slider}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Fotos da Farvalle"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        setPaused(false);
        if (start === null) return;
        const delta = event.changedTouches[0].clientX - start;
        if (Math.abs(delta) > 40) go(delta < 0 ? index + 1 : index - 1);
      }}
    >
      <div className={styles.track}>
        {slides.map((slide, position) => (
          <figure
            key={slide.src}
            className={`${styles.slide} ${position === index ? styles.active : ""}`}
            aria-hidden={position !== index}
          >
            <Image src={slide.src} alt={slide.alt} fill sizes="100vw" priority={position === 0} className={styles.img} />
            {slide.caption && <figcaption className={styles.caption}>{slide.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {count > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Escolher foto">
          {slides.map((slide, position) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={position === index}
              aria-label={`Foto ${position + 1} de ${count}`}
              className={`${styles.dot} ${position === index ? styles.dotActive : ""}`}
              onClick={() => go(position)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
