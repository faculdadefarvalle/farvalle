import { IoLogoWhatsapp } from "react-icons/io";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "../../lib/site-content";
import styles from "./style.module.scss";

/** Botão flutuante do WhatsApp da Farvalle: canto inferior direito, acompanha a rolagem (desktop e celular). */
export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label={`Falar com a Farvalle pelo WhatsApp (${WHATSAPP_DISPLAY})`}
    >
      <IoLogoWhatsapp size={28} aria-hidden="true" />
      <span className={styles.label}>Fale conosco</span>
    </a>
  );
}
