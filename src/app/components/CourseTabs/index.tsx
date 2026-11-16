"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { PrismicRichText } from "@prismicio/react";
import type * as prismic from "@prismicio/client";
import styles from "./style.module.scss";

export type CourseTab = {
  id: string;
  label: string;
  field: prismic.RichTextField;
};

type CourseTabsProps = {
  tabs: CourseTab[];
  /** Foto exibida ao lado do texto da primeira aba ("Sobre o curso"). */
  image?: { src: string; alt: string; position?: string };
};

const components = {
  heading1: ({ children }: { children: React.ReactNode }) => <h3 className={styles.h3}>{children}</h3>,
  heading2: ({ children }: { children: React.ReactNode }) => <h3 className={styles.h3}>{children}</h3>,
  heading3: ({ children }: { children: React.ReactNode }) => <h4 className={styles.h4}>{children}</h4>,
  paragraph: ({ children }: { children: React.ReactNode }) => <p className={styles.p}>{children}</p>,
  list: ({ children }: { children: React.ReactNode }) => <ul className={styles.ul}>{children}</ul>,
  oList: ({ children }: { children: React.ReactNode }) => <ol className={styles.ul}>{children}</ol>,
  listItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  oListItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
};

export function CourseTabs({ tabs, image }: CourseTabsProps) {
  const available = tabs.filter((tab) => tab.field && tab.field.length > 0);
  const [active, setActive] = useState(available[0]?.id || "");
  const current = available.find((tab) => tab.id === active) || available[0];
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (!current) {
    return null;
  }

  // Navegação por teclado no tablist (setas, Home e End), como recomenda o padrão WAI-ARIA.
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: (index + 1) % available.length,
      ArrowLeft: (index - 1 + available.length) % available.length,
      Home: 0,
      End: available.length - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const tab = available[next];
    setActive(tab.id);
    tabRefs.current[tab.id]?.focus();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs} role="tablist" aria-label="Informações do curso">
        {available.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[tab.id] = element;
            }}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            tabIndex={tab.id === current.id ? 0 : -1}
            aria-selected={tab.id === current.id}
            aria-controls={`panel-${tab.id}`}
            className={`${styles.tab} ${tab.id === current.id ? styles.tabActive : ""}`}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className={`${styles.panel} ${image && current.id === available[0].id ? styles.panelWithPhoto : ""}`}
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
      >
        <div className={styles.panelText}>
          <h2 className={styles.title}>{current.label}</h2>
          <PrismicRichText field={current.field} components={components} />
        </div>
        {image && current.id === available[0].id && (
          <div className={styles.panelPhoto}>
            <Image
              src={image.src}
              alt={image.alt}
              width={760}
              height={500}
              sizes="(max-width: 900px) 100vw, 320px"
              style={image.position ? { objectPosition: image.position } : undefined}
            />
            <span className={styles.panelTri} aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
