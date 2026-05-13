import * as prismic from "@prismicio/client";
import fs from "node:fs/promises";
import path from "node:path";

const repositoryName = "faculdade-farvalle";
const lang = "pt-br";

const root = process.cwd();
const userProfile = process.env.USERPROFILE || process.env.HOME;

const richText = (text) => [
  {
    type: "paragraph",
    text,
    spans: [],
  },
];

const webLink = (url, target) => ({
  link_type: "Web",
  url,
  ...(target ? { target } : {}),
});

const file = async (relativePath, type) =>
  new File([await fs.readFile(path.join(root, relativePath))], path.basename(relativePath), {
    type,
  });

const readPrismicAuthToken = async () => {
  const authPath = path.join(userProfile, ".prismic");
  const auth = JSON.parse(await fs.readFile(authPath, "utf8"));
  const token = auth.cookies?.match(/prismic-auth=([^;]+)/)?.[1];

  if (!token) {
    throw new Error("Prismic auth token not found. Log in through Slice Machine first.");
  }

  return token;
};

const accessToken = (await fs.readFile(path.join(root, ".env"), "utf8"))
  .split(/\r?\n/)
  .find((line) => line.startsWith("PRISMIC_ACCESS_TOKEN="))
  ?.split("=")
  .slice(1)
  .join("=");

const readClient = prismic.createClient(repositoryName, {
  accessToken,
});

const writeClient = prismic.createWriteClient(repositoryName, {
  writeToken: await readPrismicAuthToken(),
});

const migration = prismic.createMigration();

const assets = {
  headerLogo: migration.createAsset(
    await file("public/farvalle-logo.png", "image/png"),
    "farvalle-logo.png",
    { alt: "Farvalle Logo", tags: ["farvalle"] },
  ),
  headerLogoIcon: migration.createAsset(
    await file("public/farvalle-icon.png", "image/png"),
    "farvalle-icon.png",
    { alt: "Farvalle Logo", tags: ["farvalle"] },
  ),
  footerLogo: migration.createAsset(
    await file("public/farvalle-logo-white.png", "image/png"),
    "farvalle-logo-white.png",
    { alt: "Logo Farvalle", tags: ["farvalle"] },
  ),
  emecLogo: migration.createAsset(await file("public/e-mec.webp", "image/webp"), "e-mec.webp", {
    alt: "e-MEC logo",
    tags: ["farvalle"],
  }),
  emecQr: migration.createAsset(
    await file("public/qr-code-farvalle.svg", "image/svg+xml"),
    "qr-code-farvalle.svg",
    { alt: "QR Code e-MEC", tags: ["farvalle"] },
  ),
  homeBanner: migration.createAsset(
    await file("public/farvalle-banner.jpg", "image/jpeg"),
    "farvalle-banner.jpg",
    { alt: "Banner Farvalle", tags: ["farvalle"] },
  ),
  building: migration.createAsset(await file("public/predio.webp", "image/webp"), "predio.webp", {
    alt: "Prédio da Farvalle",
    tags: ["farvalle"],
  }),
};

const siteSettingsData = {
  logo: assets.headerLogo,
  logo_icon: assets.headerLogoIcon,
  navigation: [
    { label: "A FARVALLE", link: webLink("https://farvalle.edu.br/posts/sobre"), parent_label: null, variant: "link" },
    { label: "SOBRE", link: webLink("https://farvalle.edu.br/posts/sobre"), parent_label: "A FARVALLE", variant: "link" },
    {
      label: "PUBLICAÇÕES INSTITUCIONAIS",
      link: webLink("https://farvalle.edu.br/publicacoes-institucionais"),
      parent_label: "A FARVALLE",
      variant: "link",
    },
    { label: "CONTATO", link: webLink("https://farvalle.edu.br/contato"), parent_label: "A FARVALLE", variant: "link" },
    { label: "GRADUAÇÃO", link: webLink("https://farvalle.edu.br"), parent_label: null, variant: "link" },
    {
      label: "ENFERMAGEM",
      link: webLink("https://farvalle.edu.br/cursos/enfermagem"),
      parent_label: "GRADUAÇÃO",
      variant: "link",
    },
    {
      label: "FISIOTERAPIA",
      link: webLink("https://farvalle.edu.br/cursos/fisioterapia"),
      parent_label: "GRADUAÇÃO",
      variant: "link",
    },
    {
      label: "PEDAGOGIA",
      link: webLink("https://farvalle.edu.br/cursos/pedagogia"),
      parent_label: "GRADUAÇÃO",
      variant: "link",
    },
    { label: "CONTATO", link: webLink("https://farvalle.edu.br/contato"), parent_label: null, variant: "link" },
    {
      label: "ACESSE O PORTAL",
      link: webLink("https://educacional.usecerbrum.net/inicio.aspx", "_blank"),
      parent_label: null,
      variant: "portal",
    },
    { label: "INSCREVA-SE", link: webLink("https://farvalle.edu.br/matricular"), parent_label: null, variant: "primary" },
  ],
  footer_logo: assets.footerLogo,
  footer_description: richText(
    "Situada em Amargosa, destaca-se como uma instituição de ensino superior comprometida com a excelência acadêmica e a formação de profissionais qualificados. Com cursos nas áreas de enfermagem, fisioterapia e pedagogia, a faculdade alia teoria e prática em sua metodologia de ensino.",
  ),
  address: "Avenida Dr. Luís Sande, 147, Santa Rita, Valle Shopping - Amargosa/BA",
  email: "faculdade.farvalle@gmail.com",
  phone: "+55 75 98870-8022",
  footer_links: [
    { label: "Inicio", link: webLink("https://farvalle.edu.br") },
    { label: "Portal do Aluno", link: webLink("https://educacional.usecerbrum.net/inicio.aspx", "_blank") },
    { label: "Calendário Acadêmico", link: webLink("https://farvalle.edu.br/publicacoes-institucionais") },
    { label: "Contato", link: webLink("https://farvalle.edu.br/contato") },
    { label: "Inscreva-se", link: webLink("https://farvalle.edu.br/matricular") },
  ],
  social_links: [
    {
      platform: "whatsapp",
      link: webLink("https://api.whatsapp.com/send/?phone=5575988708022&text&type=phone_number&app_absent=0", "_blank"),
    },
    { platform: "instagram", link: webLink("https://www.instagram.com/farvalle/", "_blank") },
    { platform: "facebook", link: webLink("https://farvalle.edu.br", "_blank") },
    { platform: "youtube", link: webLink("https://farvalle.edu.br", "_blank") },
  ],
  emec_text: "Consulte o cadastro da instituição no sistema e-MEC",
  emec_logo: assets.emecLogo,
  emec_qr_code: assets.emecQr,
  emec_link: webLink(
    "https://emec.mec.gov.br/emec/consulta-cadastro/detalhes-ies/d96957f455f6405d14c6542552b0f6eb/MjU0Mzk=",
    "_blank",
  ),
  copyright: "Faculdade Farvalle © 2025 - Todos os direitos reservados.",
  developer_text: "Desenvolvido por:",
};

const homepageData = {
  banner: assets.homeBanner,
  intro_sections: [
    {
      title: "Presencial é a modalidade certa para você!",
      content: richText(
        "Na FARVALLE você encontra aulas 100% presenciais! Temos um campus pertinho de você em uma excelente localização, uma infraestrutura invejável de primeiro mundo, que junto ao nosso staff extremamente qualificado permite que você explore o máximo do seu potencial e se desenvolva de maneira exponencial!",
      ),
    },
    {
      title: "Sobre a Faculdade",
      content: richText(
        "A história da Faculdade Regional do Valle, FARVALLE, está intimamente ligada ao percurso profissional e vida de sua idealizadora, a professora Vera Lúcia Suzart de Almeida Bellato Maciel. Nesse contexto, e diante de sua experiência na gestão, no ensino, pesquisa e extensão, pautados na capacidade inovadora e empreendedora, surgiu o interesse na criação da FARVALLE com o objetivo de contribuir para o desenvolvimento socioeconômico, cultural e ambiental da sociedade baiana.",
      ),
    },
  ],
  building_image: assets.building,
  featured_courses: [],
  latest_posts_title: "Últimas Novidades",
};

const upsertSingle = async ({ type, title, data }) => {
  try {
    const existing = await readClient.getSingle(type);
    migration.updateDocument(
      {
        ...existing,
        data,
      },
      title,
    );
    console.log(`Queued update for ${type}`);
  } catch (error) {
    migration.createDocument(
      {
        type,
        lang,
        tags: [],
        data,
      },
      title,
    );
    console.log(`Queued create for ${type}`);
  }
};

await upsertSingle({
  type: "site_settings",
  title: "Configurações do Site",
  data: siteSettingsData,
});

await upsertSingle({
  type: "homepage",
  title: "Página Inicial",
  data: homepageData,
});

await writeClient.migrate(migration, {
  reporter(event) {
    console.log(event.type, event.data ? JSON.stringify(event.data) : "");
  },
});

console.log("Prismic default content migration finished.");
