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
