/**
 * Conteúdo institucional fixo do redesign (textos do layout aprovado).
 * Dados dinâmicos (cursos, notícias, publicações, contatos) continuam vindo do Prismic.
 */

export type CourseKey = "enfermagem" | "fisioterapia" | "pedagogia";

export type CourseMeta = {
  uid: CourseKey;
  name: string;
  degree: string;
  tagline: string;
  summary: string;
  semesters: string;
  modality: string;
  /** Como no layout aprovado — valores a confirmar com a instituição antes de ir ao ar. */
  shift?: string;
  coordination?: string;
  /** Texto "Sobre o curso" usado quando o CMS não tem descrição extensa. */
  about: string;
  image: string;
  /** Artes do layout aprovado para a página do curso (opcionais). */
  heroArt?: string;
  heroArtRatio?: number;
  heroImage?: string;
  aboutImage?: string;
  /** Enquadramento da foto "Sobre o curso" (object-position). Regra: nunca cortar a cabeça. */
  aboutPosition?: string;
  audience: string[];
  highlights: string[];
};

export const COURSES: Record<CourseKey, CourseMeta> = {
  enfermagem: {
    uid: "enfermagem",
    name: "Enfermagem",
    degree: "Bacharelado",
    tagline: "Cuidado de pessoas para um futuro mais humano.",
    summary:
      "Forme-se para atuar na promoção, prevenção e recuperação da saúde, com uma formação completa e alinhada às necessidades reais da sociedade.",
    semesters: "10 semestres",
    modality: "Presencial",
    shift: "Noturno",
    coordination: "Em breve",
    about:
      "O curso de Enfermagem da Farvalle forma profissionais capacitados para atuar em diferentes níveis de atenção à saúde, com base em conhecimento científico, prática qualificada e compromisso com o cuidado integral das pessoas.\n\nAqui, você desenvolve competências técnicas, humanas e éticas para fazer a diferença na vida das pessoas e na sua comunidade.",
    image: "/images/redesign/curso-enfermagem.jpg",
    heroArt: "/images/redesign/curso-enfermagem-hero-bg.jpg",
    heroArtRatio: 611 / 230,
    heroImage: "/images/redesign/curso-enfermagem-hero.jpg",
    aboutImage: "/images/redesign/curso-enfermagem-sobre.jpg",
    aboutPosition: "50% 0%",
    audience: [
      "Pessoas que se identificam com o cuidado e o trabalho com pessoas",
      "Quem busca uma profissão com grande impacto social",
      "Interessados em atuar em hospitais, clínicas, atenção básica e saúde pública",
      "Quem quer construir uma carreira sólida e cheia de possibilidades",
    ],
    highlights: ["Hospitais e clínicas", "Atenção básica", "Saúde pública", "Gestão em saúde"],
  },
  fisioterapia: {
    uid: "fisioterapia",
    name: "Fisioterapia",
    degree: "Bacharelado",
    tagline: "Movimento, saúde e mais qualidade de vida.",
    summary:
      "Forme-se para promover reabilitação, prevenção e bem-estar, atuando com pessoas em todas as fases da vida.",
    semesters: "10 semestres",
    modality: "Presencial",
    shift: "Noturno",
    coordination: "Em breve",
    about:
      "O curso de Fisioterapia da Farvalle prepara profissionais capazes de promover, manter e recuperar a funcionalidade e a qualidade de vida das pessoas, atuando em diferentes contextos da saúde e no movimento humano.\n\nAqui, você aprende na prática, com uma visão ampla e atualizada da profissão, unindo ciência, cuidado e propósito.",
    image: "/images/redesign/curso-fisioterapia.jpg",
    heroArt: "/images/redesign/curso-fisioterapia-hero-bg.jpg",
    heroArtRatio: 545 / 190,
    heroImage: "/images/redesign/curso-fisioterapia-hero.jpg",
    aboutImage: "/images/redesign/curso-fisioterapia-sobre.jpg",
    aboutPosition: "50% 0%",
    audience: [
      "Pessoas que se interessam pelo corpo humano e pelo movimento",
      "Quem gosta de ajudar pessoas a recuperarem sua autonomia",
      "Interessados em atuar em clínicas, hospitais, esportes, empresas e saúde pública",
      "Quem busca uma carreira dinâmica e com muitas áreas de atuação",
    ],
    highlights: ["Clínicas e hospitais", "Esporte e academias", "Saúde do trabalhador", "Reabilitação"],
  },
  pedagogia: {
    uid: "pedagogia",
    name: "Pedagogia",
    degree: "Licenciatura",
    tagline: "Educar e abrir caminhos para um futuro com mais oportunidades.",
    summary:
      "Forme-se para atuar na educação, contribuindo para o desenvolvimento de pessoas, comunidades e da sociedade.",
    semesters: "8 semestres",
    modality: "Presencial",
    shift: "Noturno",
    coordination: "Em breve",
    about:
      "O curso de Pedagogia da Farvalle prepara educadores para atuar em diferentes espaços, contribuindo para a formação de sujeitos críticos, criativos e comprometidos com uma sociedade mais justa e inclusiva.\n\nAqui, você desenvolve uma visão humana e transformadora da educação, com base em teoria, prática e realidade local.",
    image: "/images/redesign/curso-pedagogia.jpg",
    heroArt: "/images/redesign/curso-pedagogia-hero-bg.jpg",
    heroArtRatio: 514 / 190,
    heroImage: "/images/redesign/curso-pedagogia-hero.jpg",
    aboutImage: "/images/redesign/curso-pedagogia-sobre.jpg",
    aboutPosition: "50% 36%",
    audience: [
      "Pessoas que acreditam no poder da educação",
      "Quem se identifica com o trabalho com crianças, jovens e comunidades",
      "Interessados em atuar em escolas, projetos sociais, gestão educacional e muito mais",
      "Quem quer fazer parte da construção de um futuro com mais oportunidades",
    ],
    highlights: ["Docência", "Gestão educacional", "Projetos sociais", "Concursos públicos"],
  },
};

export const COURSE_LIST = Object.values(COURSES);

/** Edição vigente do processo seletivo (único lugar a atualizar a cada semestre). */
export const VESTIBULAR_EDITION = "Vestibular 2026.2";

export const HERO = {
  eyebrow: VESTIBULAR_EDITION,
  title: ["Educação", "de hoje para", "um amanhã"],
  /** Quebras do celular (cada linha é justificada na largura toda). */
  titleMobile: ["Educação de hoje para um"],
  titleMobileLast: "amanhã com",
  accentLead: "com",
  accent: "mais",
  accentEnd: "oportunidades.",
  text: "Na Farvalle, você encontra formação de qualidade, professores experientes e um ambiente que valoriza pessoas, histórias e novos caminhos.",
  /** Versão curta para o celular. */
  textShort: "Formação de qualidade, professores experientes e um ambiente que valoriza pessoas e novos caminhos.",
  words: ["Pessoas", "Formação", "Oportunidade", "Saúde", "Desenvolvimento", "Território", "Transformação"],
};

/** Fotos do carrossel do hero no celular (artes do layout aprovado). */
export const HERO_SLIDES = [
  { src: "/images/redesign/hero-estudantes.jpg", alt: "Estudantes da Farvalle", caption: "Mais pessoas, mais futuro." },
  { src: "/images/redesign/cta.jpg", alt: "Estudante da Farvalle", caption: `${VESTIBULAR_EDITION}: inscrições abertas.` },
  { src: "/images/redesign/predio.jpg", alt: "Turma da Farvalle em sala de aula", caption: "No coração de Amargosa." },
  { src: "/images/redesign/curso-enfermagem-hero.jpg", alt: "Estudante de Enfermagem", caption: "Enfermagem, Fisioterapia e Pedagogia." },
];

/** Faixa verde da home (entre o hero e os cursos). */
export const MISSION = {
  eyebrow: "Nosso compromisso",
  lead: "Educação superior de qualidade é",
  accent: "direito de todos",
  end: "— e a Farvalle forma profissionais e cidadãos para transformar a nossa região.",
};

export const WHY = {
  eyebrow: "Por que escolher a Farvalle",
  title: "Pessoas hoje.",
  accent: "Grandes histórias amanhã.",
  text: "A Farvalle – Faculdade Regional do Valle é uma instituição de ensino superior próxima da comunidade, que acredita no poder da educação para transformar vidas. Com foco na formação de profissionais qualificados e no desenvolvimento regional, oferecemos um ambiente acolhedor, inovador e cheio de oportunidades.",
  items: [
    { icon: "graduation", label: "Educação de qualidade" },
    { icon: "growth", label: "Desenvolvimento pessoal e profissional" },
    { icon: "community", label: "Conexão com a comunidade" },
    { icon: "idea", label: "Mais oportunidades para o seu futuro" },
  ],
};

export const NUMBERS = {
  eyebrow: "Farvalle em números",
  title: ["Mais pessoas,", "mais histórias,", "mais futuro."],
  items: [
    { icon: "graduation", value: "3 cursos", label: "de graduação presencial" },
    { icon: "building", value: "Amargosa/BA", label: "campus no Valle Shopping, no coração da região" },
    { icon: "region", value: "Contribuição", label: "para o desenvolvimento da região" },
    { icon: "handshake", value: "Parcerias", label: "que geram novas oportunidades" },
  ],
};

export const PUBLICATIONS = {
  eyebrow: "Publicações",
  title: "Conteúdos que ampliam",
  accent: "conhecimento e oportunidades.",
  text: "Acesse nossos materiais, documentos e informações institucionais.",
  items: [
    {
      icon: "calendar",
      title: "Calendário Acadêmico",
      text: "Datas, períodos letivos e prazos importantes.",
      href: "/publicacoes-institucionais#calendario",
    },
    {
      icon: "book",
      title: "Regulamentos",
      text: "Documentos e orientações institucionais.",
      href: "/publicacoes-institucionais#regulamentos",
    },
    {
      icon: "file",
      title: "Editais e Processos",
      text: "Vestibular, seleções e informações institucionais.",
      href: "/matricular",
    },
  ],
};

/** CTA da página de inscrição (layout aprovado): três ganhos com ícones. */
export const CTA_INSCRICAO = {
  title: "Seu futuro começa aqui.",
  text: "Na Farvalle, você encontra uma formação de qualidade, professores experientes e um ambiente que acredita no seu potencial. Mais que um curso, é um caminho para transformar realidades – a sua e a de muitas outras pessoas.",
  items: [
    { icon: "people", label: "Mais pessoas qualificadas" },
    { icon: "chart", label: "Mais oportunidades na região" },
    { icon: "heart", label: "Mais vidas transformadas" },
  ],
};

export const CTA = {
  eyebrow: VESTIBULAR_EDITION,
  title: "Seu futuro começa aqui.",
  text: "Dê o próximo passo com uma formação que transforma realidades e abre novos caminhos.",
  checks: [
    "Cursos presenciais de qualidade",
    "Professores experientes",
    "Estrutura moderna",
    "Conexão com o mercado",
    "Oportunidades reais de crescimento",
  ],
};

export const ABOUT = {
  eyebrow: "A Farvalle",
  title: "Mais que uma faculdade,",
  accent: "parte da nossa história.",
  intro:
    "A Farvalle acredita no potencial das pessoas e no desenvolvimento da nossa região. No coração de Amargosa e do Recôncavo Baiano, oferecemos educação que gera oportunidades para a nossa gente e para o território.",
  history:
    "A história da Faculdade Regional do Valle, FARVALLE, está intimamente ligada ao percurso profissional e à vida de sua idealizadora, a professora Vera Lúcia Suzart de Almeida Bellato Maciel. Diante de sua experiência na gestão, no ensino, na pesquisa e na extensão, pautados na capacidade inovadora e empreendedora, surgiu o interesse na criação da FARVALLE com o objetivo de contribuir para o desenvolvimento socioeconômico, cultural e ambiental da sociedade baiana.",
  presencial:
    "Na FARVALLE você encontra aulas 100% presenciais, em um campus bem localizado no Valle Shopping, com infraestrutura completa e um corpo docente qualificado que permite explorar o máximo do seu potencial.",
  values: [
    { title: "Formação de qualidade", text: "Cursos presenciais com base científica, prática qualificada e compromisso com o cuidado integral." },
    { title: "Professores experientes", text: "Corpo docente com vivência de mercado e dedicação ao desenvolvimento de cada estudante." },
    { title: "Estrutura completa", text: "Laboratórios, salas modernas e um campus pertinho de você, no Valle Shopping." },
    { title: "Conexão com o mercado", text: "Parcerias, estágios e projetos que aproximam o estudante da realidade profissional." },
    { title: "Acolhimento e oportunidades", text: "Um ambiente próximo da comunidade, que valoriza pessoas, histórias e novos caminhos." },
  ],
};

export const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=5575988708022&text=Ol%C3%A1!%20Quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20cursos%20da%20Farvalle.&type=phone_number&app_absent=0";

export const WHATSAPP_DISPLAY = "(75) 98870-8022";

export function courseMeta(uid: string): CourseMeta | undefined {
  return COURSES[uid as CourseKey];
}
