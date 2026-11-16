import localFont from "next/font/local";

/**
 * Fontes embutidas no projeto (sem depender de rede no build).
 * Montserrat: identidade do layout. Caveat: frases manuscritas dos heros.
 */
export const montserrat = localFont({
  src: [
    { path: "./montserrat-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./montserrat-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./montserrat-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./montserrat-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./montserrat-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-montserrat",
});

export const caveat = localFont({
  src: [{ path: "./caveat-latin-600-normal.woff2", weight: "600", style: "normal" }],
  display: "swap",
  variable: "--font-script",
});
