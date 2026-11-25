import { getHomeContent } from "../../lib/prismic-content";
import { Hero } from "../Home/Hero";
import { Mission } from "../Home/Mission";
import { Courses } from "../Home/Courses";
import { Why } from "../Home/Why";
import { Numbers } from "../Home/Numbers";
import { News } from "../Home/News";
import { Publications } from "../Home/Publications";
import { Cta } from "../Home/Cta";

export async function Main() {
  const content = await getHomeContent();

  return (
    <>
      {/*
        Decisão do redesign: o banner do Prismic (`content.banner`) era a imagem larga do antigo carrossel,
        com texto embutido, e não cabe na moldura 790x500 do novo hero. A foto do hero vem do layout
        aprovado; para voltar a controlá-la pelo CMS basta passar `image={content.banner}` aqui.
        Os `intro_sections` do Prismic também deixaram de ser usados: o texto institucional da home
        agora vem de `lib/site-content.ts` (WHY) e a página /a-farvalle continua lendo o post "sobre".
      */}
      <Hero />
      <Mission />
      <Courses courses={content.courses} />
      <Why image={content.buildingImage} />
      <Numbers />
      <News title={content.latestPostsTitle} />
      <Publications />
      <Cta />
    </>
  );
}
