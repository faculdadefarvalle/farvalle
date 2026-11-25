import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Farvalle: WhatsApp, telefone, e-mail e endereço em Amargosa/BA. Tire dúvidas sobre cursos, vestibular e matrícula.",
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
