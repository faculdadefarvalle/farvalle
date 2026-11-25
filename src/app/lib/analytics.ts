/** Google Analytics 4 — só carrega depois que o visitante aceita os cookies. */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const CONSENT_KEY = "fv-cookies";
export const CONSENT_EVENT = "fv-cookies-abrir";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** Registra um evento no Analytics (ignorado se o visitante não aceitou ou se não há ID). */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Abre de novo o aviso de cookies (link "Preferências de cookies" do rodapé). */
export function abrirPreferenciasCookies() {
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
