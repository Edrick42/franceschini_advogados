import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articleCategory = z.enum([
  "Contencioso",
  "Recursos",
  "Arbitragem",
  "Recuperacao",
]);

const articlesPt = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles-pt" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default("Franceschini Advogados Associados"),
    category: articleCategory.default("Contencioso"),
    hero: z.string().optional(),
    heroAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const articlesEn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles-en" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default("Franceschini Advogados Associados"),
    category: articleCategory.default("Contencioso"),
    hero: z.string().optional(),
    heroAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/team" }),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    role: z.object({ pt: z.string(), en: z.string() }),
    isFounder: z.boolean().default(false),
    bio: z.object({ pt: z.string(), en: z.string() }),
    fullBio: z
      .object({
        pt: z.array(z.string()).default([]),
        en: z.array(z.string()).default([]),
      })
      .default({ pt: [], en: [] }),
    education: z.array(z.string()).default([]),
    photo: z.string().default(""),
  }),
});

const practiceAreas = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/practice-areas" }),
  schema: z.object({
    order: z.number(),
    slug: z.string(),
    name: z.object({ pt: z.string(), en: z.string() }),
    summary: z.object({ pt: z.string(), en: z.string() }),
    description: z.object({ pt: z.string(), en: z.string() }),
    typicalCases: z
      .object({
        pt: z.array(z.string()).default([]),
        en: z.array(z.string()).default([]),
      })
      .default({ pt: [], en: [] }),
  }),
});

export const collections = {
  "articles-pt": articlesPt,
  "articles-en": articlesEn,
  team,
  "practice-areas": practiceAreas,
};
