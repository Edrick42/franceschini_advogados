import site from "~/data/site.json";
import type { Locale } from "~/i18n/utils";

const MAX_TITLE = 70;
const MAX_DESC = 160;

export interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
}

export function buildTitle(title: string | undefined, locale: Locale): string {
  if (!title) {
    const tagline = site.tagline[locale];
    return `${site.name} · ${tagline}`;
  }
  const composed = `${title} · ${site.shortName}`;
  return composed.length > MAX_TITLE ? title : composed;
}

export function buildDescription(description: string | undefined, locale: Locale): string {
  const value = description ?? site.description[locale];
  if (value.length <= MAX_DESC) return value;
  return value.slice(0, MAX_DESC - 1).trimEnd() + "…";
}
