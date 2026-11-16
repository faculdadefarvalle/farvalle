"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, CONSENT_KEY, GA_ID, trackEvent } from "../../lib/analytics";
import styles from "./style.module.scss";

type Escolha = "aceito" | "recusado";

function lerEscolha(): Escolha | null {
  try {
    const valor = window.localStorage.getItem(CONSENT_KEY);
    return valor === "aceito" || valor === "recusado" ? valor : null;
  } catch {
    return null;
  }
}

function salvarEscolha(escolha: Escolha) {
  try {
    window.localStorage.setItem(CONSENT_KEY, escolha);
  } catch {
    /* sem armazenamento: vale só para esta visita */
  }
}

let carregado = false;
function carregarAnalytics() {
  if (!GA_ID || carregado) return;
  carregado = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

/** Contatos (WhatsApp, telefone, e-mail) contam como "lead" no Analytics. */
function ouvirContatos() {
  document.addEventListener(
    "click",
    (event) => {
      const link = (event.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const canal = /wa\.me|whatsapp\.com/.test(href)
        ? "whatsapp"
        : href.startsWith("tel:")
          ? "telefone"
          : href.startsWith("mailto:")
            ? "email"
            : "";
      if (canal) trackEvent("generate_lead", { method: canal, link_url: href });
    },
    { capture: true }
  );
}

export function CookieConsent() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const escolha = lerEscolha();
    if (escolha === "aceito") carregarAnalytics();
    else if (!escolha) setAberto(true);
    ouvirContatos();
    const abrir = () => setAberto(true);
    window.addEventListener(CONSENT_EVENT, abrir);
    return () => window.removeEventListener(CONSENT_EVENT, abrir);
  }, []);

  if (!GA_ID || !aberto) return null;

  const escolher = (escolha: Escolha) => {
    salvarEscolha(escolha);
    if (escolha === "aceito") carregarAnalytics();
    setAberto(false);
  };

  return (
    <div className={styles.aviso} role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <p>
        Usamos cookies do Google Analytics para entender como o site é usado e melhorar sua experiência. Nada é
        medido sem a sua permissão.
      </p>
      <div className={styles.botoes}>
        <button type="button" className="fv-btn fv-btn--outline-green" onClick={() => escolher("recusado")}>
          Recusar
        </button>
        <button type="button" className="fv-btn fv-btn--primary" onClick={() => escolher("aceito")}>
          Aceitar
        </button>
      </div>
    </div>
  );
}

/** Link do rodapé para rever a escolha de cookies. */
export function CookiePreferencesLink({ className }: { className?: string }) {
  if (!GA_ID) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
    >
      Preferências de cookies
    </button>
  );
}
