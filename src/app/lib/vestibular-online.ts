/**
 * Vestibular online (prova de redação).
 *
 * Regras da prova e banco de temas. A coordenação pode editar este arquivo:
 * - para tirar um tema do sorteio, mude `ativo` para false;
 * - para incluir um tema, copie um bloco e troque `id`, `titulo` e `textos`.
 * Os temas marcados com `revisar: true` foram redigidos pela Nexus e aguardam
 * aprovação da coordenação acadêmica.
 */

export const PROVA = {
  /** Tempo de prova, em minutos. */
  duracaoMin: 60,
  /** Limites de palavras da redação. */
  minPalavras: 150,
  maxPalavras: 500,
  /** Chave do rascunho salvo no navegador do candidato. */
  storageKey: "fv-vestibular-online-v1",
  /** Rascunhos mais antigos que isso são descartados (horas). */
  validadeRascunhoH: 24,
};

export type TemaRedacao = {
  id: string;
  titulo: string;
  /** Textos motivadores, um parágrafo por item. */
  textos: string[];
  ativo: boolean;
  revisar?: boolean;
};

const comando = (titulo: string) =>
  `Com base nos conhecimentos construídos ao longo de sua formação, redija texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema “${titulo}”, apresentando proposta de intervenção que respeite os direitos humanos. Selecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defesa de seu ponto de vista.`;

export const TEMAS: TemaRedacao[] = [
  {
    id: "exclusao-social",
    titulo: "Exclusão Social",
    ativo: true,
    textos: [
      "A Exclusão Social designa um processo de afastamento e privação de determinados indivíduos ou de grupos sociais em diversos âmbitos da estrutura da sociedade.",
      "Trata-se de uma condição inerente ao capitalismo contemporâneo, ou seja, esse problema social foi impulsionado pela estrutura desse sistema econômico e político.",
      comando("Exclusão Social"),
    ],
  },
  {
    id: "saude-mental-jovens",
    titulo: "Os desafios da saúde mental dos jovens na era digital",
    ativo: true,
    revisar: true,
    textos: [
      "Redes sociais, jogos e aplicativos fazem parte da rotina de quase todos os jovens brasileiros. Ao mesmo tempo em que aproximam pessoas e ampliam o acesso à informação, o uso excessivo das telas tem sido associado a ansiedade, comparação constante e dificuldades de sono.",
      "Escolas, famílias e serviços de saúde ainda buscam caminhos para equilibrar os benefícios da tecnologia com o cuidado emocional de quem cresce conectado.",
      comando("Os desafios da saúde mental dos jovens na era digital"),
    ],
  },
  {
    id: "ia-trabalho",
    titulo: "Inteligência artificial e o futuro do trabalho no Brasil",
    ativo: true,
    revisar: true,
    textos: [
      "Ferramentas de inteligência artificial já escrevem textos, analisam exames e atendem clientes. Para alguns, elas aumentam a produtividade e criam novas profissões; para outros, ameaçam empregos e aprofundam desigualdades entre quem tem e quem não tem acesso à qualificação.",
      "O debate envolve educação, regulação e o papel do Estado e das empresas na transição para um mercado de trabalho cada vez mais automatizado.",
      comando("Inteligência artificial e o futuro do trabalho no Brasil"),
    ],
  },
  {
    id: "desinformacao",
    titulo: "Caminhos para combater a desinformação nas redes sociais",
    ativo: true,
    revisar: true,
    textos: [
      "Notícias falsas circulam mais rápido do que as verdadeiras e podem influenciar decisões sobre saúde, eleições e segurança. Muitas vezes, quem compartilha não percebe que está espalhando um conteúdo enganoso.",
      "Educação midiática, checagem de fatos e responsabilidade das plataformas aparecem como respostas possíveis, mas também levantam discussões sobre liberdade de expressão.",
      comando("Caminhos para combater a desinformação nas redes sociais"),
    ],
  },
  {
    id: "agua-semiarido",
    titulo: "O acesso à água e a convivência com o semiárido brasileiro",
    ativo: true,
    revisar: true,
    textos: [
      "O semiárido abriga milhões de brasileiros e convive com longos períodos de estiagem. Cisternas, adutoras e tecnologias de reúso mudaram a realidade de muitas comunidades, mas o acesso regular à água de qualidade ainda não chega a todos.",
      "A questão envolve políticas públicas, preservação dos rios e a valorização de saberes locais de convivência com o clima.",
      comando("O acesso à água e a convivência com o semiárido brasileiro"),
    ],
  },
];

export const TEMAS_ATIVOS = TEMAS.filter((tema) => tema.ativo);

export function sortearTema(): TemaRedacao {
  const lista = TEMAS_ATIVOS.length ? TEMAS_ATIVOS : TEMAS;
  return lista[Math.floor(Math.random() * lista.length)];
}

export function temaPorId(id: string | undefined): TemaRedacao | undefined {
  return TEMAS.find((tema) => tema.id === id);
}

/** Texto puro a partir do HTML do editor. */
export function textoDaRedacao(html: string): string {
  return html
    .replace(/<\/(p|div|blockquote)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function contarPalavras(texto: string): number {
  const palavras = texto.match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu);
  return palavras ? palavras.length : 0;
}

export function formatarTempo(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
