import { it, expect } from "vitest";
import { buildMetadata, sitemapEntries } from "@/lib/seo";
import { getDictionary } from "@/content";
import robots from "@/app/robots";
it("canonical, all language alternatives, x-default and sitemap", () => {
  for (const path of ["", "/quote"] as const) {
    const m = buildMetadata("ja", path, getDictionary("ja"));
    expect(m.alternates?.canonical).toBe("/ja" + path);
    expect(Object.keys(m.alternates?.languages ?? {})).toHaveLength(6);
    expect(m.alternates?.languages?.["x-default"]).toBe("/en" + path);
  }
  const entries = sitemapEntries();
  expect(entries).toHaveLength(10);
  expect(new Set(entries.map((e) => e.url)).size).toBe(10);
  for (const e of entries)
    expect(Object.keys(e.alternates?.languages ?? {})).toHaveLength(5);
  expect(robots().sitemap).toMatch(/sitemap.xml$/);
});
