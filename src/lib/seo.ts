import type { Metadata, MetadataRoute } from "next";
import { LANGS, OG_LOCALE, type Lang } from "@/lib/i18n/langs";
import { site } from "@/config/site";
import type { Dictionary } from "@/content/types";
export function buildMetadata(
  lang: Lang,
  path: "" | "/quote",
  dict: Dictionary,
): Metadata {
  return {
    metadataBase: new URL(site.url),
    icons: {
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%2323453F' d='M16 2a12 12 0 0 1 12 12c0 8-12 16-12 16S4 22 4 14A12 12 0 0 1 16 2z'/%3E%3C/svg%3E",
    },
    title: path ? dict.meta.quoteTitle : dict.meta.title,
    description: path ? dict.meta.quoteDescription : dict.meta.description,
    alternates: {
      canonical: "/" + lang + path,
      languages: {
        ...Object.fromEntries(LANGS.map((l) => [l, "/" + l + path])),
        "x-default": "/en" + path,
      },
    },
    openGraph: {
      siteName: site.brand,
      locale: OG_LOCALE[lang],
      type: "website",
    },
  };
}
export function sitemapEntries(): MetadataRoute.Sitemap {
  return LANGS.flatMap((lang) =>
    ["", "/quote"].map((path) => ({
      url: site.url + "/" + lang + path,
      alternates: {
        languages: Object.fromEntries(
          LANGS.map((l) => [l, site.url + "/" + l + path]),
        ),
      },
    })),
  );
}
