import type { Metadata } from "next";
import { Main } from "./components/Main";
import { Maintenance } from "./components/Maintenance";
import { VESTIBULAR_EDITION } from "./lib/site-content";

export const metadata: Metadata = {
  title: "Farvalle — Faculdade Regional do Valle | Amargosa/BA",
  description:
    `Educação de hoje para um amanhã com mais oportunidades. Cursos presenciais de Enfermagem, Fisioterapia e Pedagogia em Amargosa/BA. Inscreva-se no ${VESTIBULAR_EDITION}.`,
};

export default function Home() {
  const isProduction = process.env.NEXT_PUBLIC_VERSION === "production";
  return isProduction ? <Main /> : <Maintenance />;
}
