import * as prismic from "@prismicio/client";
import { getClient } from "../services/prismic";

export type SiteLink = {
  label: string;
  href: string;
  target?: string;
};

export type NavigationItem = SiteLink & {
  id: string;
  variant: "link" | "portal" | "primary";
  children: SiteLink[];
};

export type SocialLink = {
  platform: "whatsapp" | "instagram" | "facebook" | "youtube";
  href: string;
  target?: string;
};

export type SiteSettings = {
  header: {
    logo?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    logoIcon?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    navigation: NavigationItem[];
  };
  footer: {
    logo?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    description: prismic.RichTextField;
    address: string;
    email: string;
    phone: string;
    links: SiteLink[];
    socialLinks: SocialLink[];
    emecText: string;
    emecLogo?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    emecQrCode?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    emecLink: string;
    copyright: string;
    developerText: string;
  };
};

export type HomeCourse = {
  id: string;
  title: string;
  modality: string;
  semesters: string;
  imageUrl: string;
  imageAlt: string;
  url: string;
};

export type HomeContent = {
  banner?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  introSections: {
    title: string;
    content: prismic.RichTextField;
  }[];
  buildingImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  courses: HomeCourse[];
  latestPostsTitle: string;
};

const defaultRichText = (text: string): prismic.RichTextField => [
  {
    type: "paragraph",
    text,
    spans: [],
  },
];

const defaultSettings: SiteSettings = {
  header: {
    navigation: [
      {
        id: "a-farvalle",
        label: "A FARVALLE",
        href: "/posts/sobre",
        variant: "link",
        children: [
          { label: "SOBRE", href: "/posts/sobre" },
          {
            label: "PUBLICAÇÕES INSTITUCIONAIS",
            href: "/publicacoes-institucionais",
          },
          { label: "CONTATO", href: "/contato" },
        ],
      },
      {
        id: "graduacao",
        label: "GRADUAÇÃO",
        href: "/",
        variant: "link",
        children: [
          { label: "ENFERMAGEM", href: "/cursos/enfermagem" },
          { label: "FISIOTERAPIA", href: "/cursos/fisioterapia" },
          { label: "PEDAGOGIA", href: "/cursos/pedagogia" },
        ],
      },
      {
        id: "contato",
        label: "CONTATO",
        href: "/contato",
        variant: "link",
        children: [],
      },
      {
        id: "portal",
        label: "ACESSE O PORTAL",
        href: "https://educacional.usecerbrum.net/inicio.aspx",
        target: "_blank",
        variant: "portal",
        children: [],
      },
      {
        id: "inscreva-se",
        label: "INSCREVA-SE",
        href: "/matricular",
        variant: "primary",
        children: [],
      },
    ],
  },
  footer: {
    description: defaultRichText(
      "Situada em Amargosa, destaca-se como uma instituição de ensino superior comprometida com a excelência acadêmica e a formação de profissionais qualificados. Com cursos nas áreas de enfermagem, fisioterapia e pedagogia, a faculdade alia teoria e prática em sua metodologia de ensino."
    ),
    address:
      "Avenida Dr. Luís Sande, 147, Santa Rita, Valle Shopping - Amargosa/BA",
    email: process.env.NEXT_PUBLIC_FARVALLE_MAIL || "",
    phone: "+55 75 98870-8022",
    links: [
      { label: "Inicio", href: "/" },
      {
        label: "Portal do Aluno",
        href: "https://educacional.usecerbrum.net/inicio.aspx",
        target: "_blank",
      },
      { label: "Calendário Acadêmico", href: "/publicacoes-institucionais" },
      { label: "Contato", href: "/contato" },
      { label: "Inscreva-se", href: "/matricular" },
    ],
    socialLinks: [
      {
        platform: "whatsapp",
        href: "https://api.whatsapp.com/send/?phone=5575988708022&text&type=phone_number&app_absent=0",
        target: "_blank",
      },
      {
        platform: "instagram",
        href: "https://www.instagram.com/farvalle/",
        target: "_blank",
      },
      { platform: "facebook", href: "/", target: "_blank" },
      { platform: "youtube", href: "/", target: "_blank" },
    ],
    emecText: "Consulte o cadastro da instituição no sistema e-MEC",
    emecLink:
      "https://emec.mec.gov.br/emec/consulta-cadastro/detalhes-ies/d96957f455f6405d14c6542552b0f6eb/MjU0Mzk=",
    copyright: "Faculdade Farvalle © 2025 - Todos os direitos reservados.",
    developerText: "Desenvolvido por:",
  },
};

const fallbackCourses: HomeCourse[] = [
  {
    id: "enfermagem",
    title: "BACHARELADO EM ENFERMAGEM",
    imageUrl:
      "https://www.souenfermagem.com.br/wp-content/uploads/2023/04/O-papel-do-enfermeiro-na-sociedade-atual-reflexoes-para-a-Semana-da-Enfermagem-_1_.webp",
    imageAlt: "Enfermagem",
    modality: "Presencial",
    semesters: "10",
    url: "/cursos/enfermagem",
  },
  {
    id: "fisioterapia",
    title: "BACHARELADO EM FISIOTERAPIA",
    imageUrl:
      "https://www.contabilizei.com.br/contabilidade-online/wp-content/uploads/2022/11/fisioterapeuta-autonomo.png",
    imageAlt: "Fisioterapia",
    modality: "Presencial",
    semesters: "10",
    url: "/cursos/fisioterapia",
  },
  {
    id: "pedagogia",
    title: "LICENCIATURA EM PEDAGOGIA",
    imageUrl: "https://teloseducacional.com.br/wp-content/uploads/2023/11/1-4.png",
    imageAlt: "Pedagogia",
    modality: "Presencial",
    semesters: "8",
    url: "/cursos/pedagogia",
  },
];

const defaultHomeContent: HomeContent = {
  introSections: [
    {
      title: "Presencial é a modalidade certa para você!",
      content: defaultRichText(
        "Na FARVALLE você encontra aulas 100% presenciais! Temos um campus pertinho de você em uma excelente localização, uma infraestrutura invejável de primeiro mundo, que junto ao nosso staff extremamente qualificado permite que você explore o máximo do seu potencial e se desenvolva de maneira exponencial!"
      ),
    },
    {
      title: "Sobre a Faculdade",
      content: defaultRichText(
        "A história da Faculdade Regional do Valle, FARVALLE, está intimamente ligada ao percurso profissional e vida de sua idealizadora, a professora Vera Lúcia Suzart de Almeida Bellato Maciel. Nesse contexto, e diante de sua experiência na gestão, no ensino, pesquisa e extensão, pautados na capacidade inovadora e empreendedora, surgiu o interesse na criação da FARVALLE com o objetivo de contribuir para o desenvolvimento socioeconômico, cultural e ambiental da sociedade baiana."
      ),
    },
  ],
  courses: fallbackCourses,
  latestPostsTitle: "Últimas Novidades",
};

const getFieldText = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim() ? value : fallback;

const getLink = (field: unknown, fallback = "/"): SiteLink => {
  const href = prismic.asLink(field as prismic.LinkField) || fallback;
  const target =
    typeof field === "object" && field && "target" in field
      ? String((field as { target?: string }).target || "")
      : "";

  return {
    label: "",
    href,
    ...(target ? { target } : {}),
  };
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const imageFromField = (field: unknown) => {
  if (!prismic.isFilled.image(field as prismic.ImageField)) {
    return undefined;
  }

  const image = field as prismic.FilledImageFieldImage;
  return {
    url: image.url,
    alt: image.alt || "",
    width: image.dimensions.width,
    height: image.dimensions.height,
  };
};

const normalizeNavigation = (items: Record<string, unknown>[]) => {
  if (!items.length) {
    return defaultSettings.header.navigation;
  }

  const parents: NavigationItem[] = [];
  const childrenByParent = new Map<string, SiteLink[]>();

  for (const item of items) {
    const label = getFieldText(item.label);
    if (!label) {
      continue;
    }

    const link = getLink(item.link);
    const parentLabel = getFieldText(item.parent_label);
    const siteLink = {
      label,
      href: link.href,
      ...(link.target ? { target: link.target } : {}),
    };

    if (parentLabel) {
      const key = slugify(parentLabel);
      childrenByParent.set(key, [...(childrenByParent.get(key) || []), siteLink]);
      continue;
    }

    const variant =
      item.variant === "portal" || item.variant === "primary"
        ? item.variant
        : "link";

    parents.push({
      ...siteLink,
      id: slugify(label),
      variant,
      children: [],
    });
  }

  return parents.map((item) => ({
    ...item,
    children: childrenByParent.get(slugify(item.label)) || [],
  }));
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const client = getClient();

  try {
    const response = await (client as any).getSingle("site_settings");
    const data = response.data as Record<string, unknown>;

    const footerLinks = ((data.footer_links as Record<string, unknown>[]) || [])
      .map((item) => ({
        ...getLink(item.link),
        label: getFieldText(item.label),
      }))
      .filter((item) => item.label);

    const socialLinks = ((data.social_links as Record<string, unknown>[]) || [])
      .map((item) => {
        const platform = item.platform as SocialLink["platform"];
        return {
          platform,
          ...getLink(item.link),
        };
      })
      .filter((item) => item.platform && item.href) as SocialLink[];

    return {
      header: {
        logo: imageFromField(data.logo),
        logoIcon: imageFromField(data.logo_icon),
        navigation: normalizeNavigation(
          (data.navigation as Record<string, unknown>[]) || []
        ),
      },
      footer: {
        logo: imageFromField(data.footer_logo),
        description: prismic.isFilled.richText(data.footer_description as prismic.RichTextField)
          ? (data.footer_description as prismic.RichTextField)
          : defaultSettings.footer.description,
        address: getFieldText(data.address, defaultSettings.footer.address),
        email: getFieldText(data.email, defaultSettings.footer.email),
        phone: getFieldText(data.phone, defaultSettings.footer.phone),
        links: footerLinks.length ? footerLinks : defaultSettings.footer.links,
        socialLinks: socialLinks.length
          ? socialLinks
          : defaultSettings.footer.socialLinks,
        emecText: getFieldText(data.emec_text, defaultSettings.footer.emecText),
        emecLogo: imageFromField(data.emec_logo),
        emecQrCode: imageFromField(data.emec_qr_code),
        emecLink: getLink(data.emec_link, defaultSettings.footer.emecLink).href,
        copyright: getFieldText(data.copyright, defaultSettings.footer.copyright),
        developerText: getFieldText(
          data.developer_text,
          defaultSettings.footer.developerText
        ),
      },
    };
  } catch {
    return defaultSettings;
  }
}

const courseFromDocument = (document: any): HomeCourse | undefined => {
  if (!document?.data) {
    return undefined;
  }

  const image = imageFromField(document.data.banner);

  return {
    id: document.id || document.uid,
    title: getFieldText(document.data.curso),
    modality: getFieldText(document.data.modalidade, "Presencial"),
    semesters: getFieldText(document.data.semestres),
    imageUrl: image?.url || fallbackCourses[0].imageUrl,
    imageAlt: image?.alt || getFieldText(document.data.curso),
    url: `/cursos/${document.uid}`,
  };
};

export async function getHomeContent(): Promise<HomeContent> {
  const client = getClient();

  try {
    const [homepage, allCourses] = await Promise.all([
      (client as any).getSingle("homepage", {
        fetchLinks: [
          "courses.curso",
          "courses.modalidade",
          "courses.semestres",
          "courses.banner",
        ],
      }),
      (client as any).getAllByType("courses", {
        pageSize: 3,
        limit: 3,
        orderings: {
          field: "document.first_publication_date",
          direction: "asc",
        },
      }),
    ]);

    const data = homepage.data as Record<string, unknown>;
    const linkedCourses = ((data.featured_courses as Record<string, any>[]) || [])
      .map((item) => courseFromDocument(item.course))
      .filter(Boolean) as HomeCourse[];
    const courses = linkedCourses.length
      ? linkedCourses
      : (allCourses.map(courseFromDocument).filter(Boolean) as HomeCourse[]);

    return {
      banner: imageFromField(data.banner),
      introSections: ((data.intro_sections as Record<string, unknown>[]) || [])
        .map((section) => ({
          title: getFieldText(section.title),
          content: prismic.isFilled.richText(section.content as prismic.RichTextField)
            ? (section.content as prismic.RichTextField)
            : defaultRichText(""),
        }))
        .filter((section) => section.title || prismic.asText(section.content)),
      buildingImage: imageFromField(data.building_image),
      courses: courses.length ? courses : defaultHomeContent.courses,
      latestPostsTitle: getFieldText(
        data.latest_posts_title,
        defaultHomeContent.latestPostsTitle
      ),
    };
  } catch {
    return defaultHomeContent;
  }
}
