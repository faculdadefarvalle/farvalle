"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./style.module.scss";

type MobileCarouselProps = {
  children: ReactNode;
  label: string;
  /** Intervalo da passagem automática (ms); 0 desliga. */
  interval?: number;
};

/**
 * Carrossel para telas estreitas: um item por vez, rolagem com o dedo (scroll-snap),
 * passagem automática e bolinhas. Em telas largas o componente pai mostra a grade normal.
 */
export function MobileCarousel({ children, label, interval = 4500 }: MobileCarouselProps) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  function scrollToIndex(next: number) {
    const track = trackRef.current;
    if (!track) return;
    const target = ((next % items.length) + items.length) % items.length;
    const child = track.children[target] as HTMLElement | undefined;
    if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  // Atualiza a bolinha ativa conforme o usuário rola
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const children = [...track.children] as HTMLElement[];
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        children.forEach((child, position) => {
          const distance = Math.abs(child.offsetLeft - track.offsetLeft + child.clientWidth / 2 - center);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = position;
          }
        });
        setIndex(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Passagem automática (pausa ao tocar e respeita "reduzir movimento")
  useEffect(() => {
    if (!interval || items.length < 2 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") scrollToIndex(index + 1);
    }, interval);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, interval, items.length, paused]);

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carrossel" aria-label={label}>
      <div
        ref={trackRef}
        className={styles.track}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => window.setTimeout(() => setPaused(false), 2500)}
      >
        {items.map((item, position) => (
          <div key={position} className={styles.item} aria-roledescription="slide" aria-label={`${position + 1} de ${items.length}`}>
            {item}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label={`Escolher item de ${label}`}>
          {items.map((_, position) => (
            <button
              key={position}
              type="button"
              role="tab"
              aria-selected={position === index}
              aria-label={`Item ${position + 1} de ${items.length}`}
              className={`${styles.dot} ${position === index ? styles.dotActive : ""}`}
              onClick={() => scrollToIndex(position)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
