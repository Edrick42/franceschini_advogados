import pt from "./pt.json";
import en from "./en.json";

export type Locale = "pt" | "en";
export const defaultLocale: Locale = "pt";
export const locales: Locale[] = ["pt", "en"];

const dictionaries = { pt, en } as const;

export type Dictionary = typeof pt;

export function getLocale(url: URL | string): Locale {
  const pathname = typeof url === "string" ? url : url.pathname;
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "pt";
}

export function t(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}

export function localizePath(path: string, locale: Locale): string {
  if (locale === "pt") return path;
  if (path === "/") return "/en/";
  if (path.startsWith("/en/") || path === "/en") return path;
  return `/en${path.startsWith("/") ? path : `/${path}`}`;
}

/* PT ↔ EN slug map for the 6 main pages, used by the language switcher. */
const slugMap: Record<string, { pt: string; en: string }> = {
  home: { pt: "/", en: "/en/" },
  firm: { pt: "/escritorio", en: "/en/firm" },
  team: { pt: "/equipe", en: "/en/team" },
  practice: { pt: "/atuacao", en: "/en/practice" },
  publications: { pt: "/publicacoes", en: "/en/publications" },
  contact: { pt: "/contato", en: "/en/contact" },
  privacy: { pt: "/politica-privacidade", en: "/en/privacy-policy" },
};

export function getAlternatePath(currentPath: string, currentLocale: Locale): string {
  const target: Locale = currentLocale === "pt" ? "en" : "pt";
  const normalized = currentPath.replace(/\/$/, "") || "/";
  for (const entry of Object.values(slugMap)) {
    if (entry[currentLocale] === normalized || `${entry[currentLocale]}/` === currentPath) {
      return entry[target];
    }
  }
  /* Publications detail pages: /publicacoes/<slug> ↔ /en/publications/<slug> */
  if (currentLocale === "pt" && normalized.startsWith("/publicacoes/")) {
    return normalized.replace("/publicacoes/", "/en/publications/");
  }
  if (currentLocale === "en" && normalized.startsWith("/en/publications/")) {
    return normalized.replace("/en/publications/", "/publicacoes/");
  }
  /* Fallback — root of the alternate language. */
  return target === "en" ? "/en/" : "/";
}

export function htmlLang(locale: Locale): string {
  return locale === "pt" ? "pt-BR" : "en-US";
}

export function ogLocale(locale: Locale): string {
  return locale === "pt" ? "pt_BR" : "en_US";
}
