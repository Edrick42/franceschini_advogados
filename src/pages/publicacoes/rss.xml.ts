import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import site from "~/data/site.json";

export async function GET(context: { site: URL }) {
  const articles = (await getCollection("articles-pt", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: `${site.name} · Publicações`,
    description: site.description.pt,
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      author: article.data.author,
      link: `/publicacoes/${article.id.replace(/\.md$/, "")}`,
    })),
    customData: `<language>pt-BR</language>`,
  });
}
