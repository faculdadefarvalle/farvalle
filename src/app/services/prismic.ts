import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import config from "../../../slicemachine.config.json";

export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName;

const routes: prismic.ClientConfig["routes"] = [
  {
    type: "courses",
    path: "/cursos/:uid",
  },
  {
    type: "posts",
    path: "/posts/:uid",
  },
  {
    type: "arquivos",
    path: "/publicacoes-institucionais",
  },
];

export const getClient = (config: prismic.ClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  prismicNext.enableAutoPreviews({ client });

  return client;
};
