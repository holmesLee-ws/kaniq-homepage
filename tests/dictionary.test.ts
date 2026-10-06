import { it, expect } from "vitest";
import { LANGS } from "@/lib/i18n/langs";
import { getDictionary } from "@/content";
import { INTERESTS } from "@/lib/quote/schema";
import { L10N } from "./fixtures/localization";
function shape(v: unknown, path = ""): string[] {
  if (Array.isArray(v))
    return [
      path + ":" + v.length,
      ...v.flatMap((x, i) => shape(x, path + "." + i)),
    ];
  if (v && typeof v === "object")
    return Object.entries(v).flatMap(([k, x]) => shape(x, path + "." + k));
  return [path];
}
function strings(v: unknown): string[] {
  return typeof v === "string"
    ? [v]
    : Array.isArray(v)
      ? v.flatMap(strings)
      : v && typeof v === "object"
        ? Object.values(v).flatMap(strings)
        : [];
}
for (const lang of LANGS)
  it(lang + " dictionary matches localization fixture and sections", () => {
    const d = getDictionary(lang);
    expect(d.lang).toBe(lang);
    expect(d.hero.headline.join("")).toBe(L10N[lang].h1);
    expect(d.local.priorityCare).toEqual(L10N[lang].care);
    expect(d.messenger.channel).toBe(L10N[lang].messenger);
    const normalize = (d: ReturnType<typeof getDictionary>) => ({
      ...d,
      hero: { ...d.hero, headline: [d.hero.headline.join("")] },
      local: { ...d.local, priorityCare: ["normalized"] },
    });
    expect(shape(normalize(d))).toEqual(shape(normalize(getDictionary("en"))));
    for (const s of strings(d)) expect(s.trim()).not.toBe("");
    expect(d.doctorOk.rows).toHaveLength(5);
    expect(d.recovery.rows).toHaveLength(4);
    expect(d.trust.steps.items).toHaveLength(4);
    expect(d.templates.items).toHaveLength(6);
    expect(d.ambassador.options).toHaveLength(4);
    expect(d.ambassador.preview.rows.length).toBeGreaterThanOrEqual(3);
    expect(d.organizations.items).toHaveLength(4);
    expect(d.trust.receipt.rows).toHaveLength(4);
    expect(d.trust.records.hospitals).toHaveLength(2);
    for (const t of d.templates.items) expect(INTERESTS).toContain(t.interest);
  });

it("provides localized interaction labels", () => {
  for (const lang of LANGS) {
    const d = getDictionary(lang);
    expect(Object.values(d.doctorOk.scrub).every((s) => s.length > 0)).toBe(
      true,
    );
    expect(d.trust.records.verify.length).toBeGreaterThan(0);
    expect(d.ambassador.preview.giveTo.length).toBeGreaterThan(0);
  }
});
