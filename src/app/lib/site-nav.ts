import type { NavigationItem, SiteLink } from "./prismic-content";

/** Menu principal do redesign (ordem e rótulos do layout aprovado).
 *  A aba "A Farvalle" foi removida a pedido do responsável (15/10/2026); a página continua acessível pelos botões "Conheça a Farvalle". */
export const MAIN_MENU: NavigationItem[] = [
  { id: "inicio", label: "Início", href: "/", variant: "link", children: [] },
  {
    id: "cursos",
    label: "Cursos",
    href: "/cursos",
    variant: "link",
    children: [
      { label: "Enfermagem", href: "/cursos/enfermagem" },
      { label: "Fisioterapia", href: "/cursos/fisioterapia" },
      { label: "Pedagogia", href: "/cursos/pedagogia" },
    ],
  },
  { id: "vestibular", label: "Vestibular", href: "/matricular", variant: "link", children: [] },
  { id: "noticias", label: "Notícias", href: "/noticias", variant: "link", children: [] },
  { id: "publicacoes", label: "Publicações", href: "/publicacoes-institucionais", variant: "link", children: [] },
  { id: "contato", label: "Contato", href: "/contato", variant: "link", children: [] },
];

export const DEFAULT_PORTAL: SiteLink = {
  label: "Portal do Aluno",
  href: "https://jasmin.farvalle.edu.br/",
  target: "_blank",
};

export const DEFAULT_PRIMARY: SiteLink = {
  label: "Inscreva-se agora",
  href: "/matricular",
};

/** `rel` seguro para links que abrem em nova aba (inclusive os que vêm do CMS). */
export function linkRel(target?: string) {
  return target === "_blank" ? "noopener noreferrer" : undefined;
}

/** Converte rótulos em CAIXA ALTA vindos do CMS para o estilo do layout ("A FARVALLE" → "A Farvalle"). */
export function titleCase(label: string) {
  const small = new Set(["a", "o", "e", "de", "do", "da", "dos", "das", "em", "para", "com"]);
  return label
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index > 0 && small.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/**
 * Monta o menu final: estrutura do layout + links de portal/inscrição e cursos
 * vindos do Prismic (quando existirem), para que continuem editáveis no CMS.
 */
export function buildNavigation(prismicNav: NavigationItem[]) {
  const portal = prismicNav.find((item) => item.variant === "portal");
  const primary = prismicNav.find((item) => item.variant === "primary");
  const graduacao = prismicNav.find(
    (item) => item.variant === "link" && item.children.length && /gradua|curso/i.test(item.label)
  );

  const menu = MAIN_MENU.map((item) =>
    item.id === "cursos" && graduacao
      ? {
          ...item,
          children: graduacao.children.map((child) => ({
            ...child,
            label: titleCase(child.label),
          })),
        }
      : item
  );

  return {
    menu,
    // Rótulos do layout; endereços continuam vindo do CMS (ex.: link do portal do aluno).
    portal: portal
      ? { ...DEFAULT_PORTAL, href: portal.href, target: portal.target || "_blank" }
      : DEFAULT_PORTAL,
    primary: primary ? { ...DEFAULT_PRIMARY, href: primary.href, target: primary.target } : DEFAULT_PRIMARY,
  };
}
