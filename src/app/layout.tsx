import type { Metadata } from "next";
import { caveat, montserrat } from "./fonts";
import "./globals.scss";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { CookieConsent } from "./components/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "Farvalle — Faculdade Regional do Valle",
    template: "%s | Farvalle",
  },
  description:
    "Faculdade Regional do Valle, em Amargosa/BA: cursos presenciais de Enfermagem, Fisioterapia e Pedagogia. Educação de hoje para um amanhã com mais oportunidades.",
  metadataBase: new URL("https://www.farvalle.edu.br"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Farvalle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NEXT_PUBLIC_VERSION === "production";

  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} ${caveat.variable}`}>
        {isProduction ? (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
            <CookieConsent />
          </>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
