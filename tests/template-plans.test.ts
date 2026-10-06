import { it, expect } from "vitest";
import { TEMPLATE_PLANS } from "@/content/shared/template-plans";
import { QUOTE_INTEREST } from "@/lib/planner/build-plan";
import { LANGS } from "@/lib/i18n/langs";
import { getDictionary } from "@/content";
for (const lang of LANGS)
  it(`${lang} template journeys match their links and lengths`, () => {
    const d = getDictionary(lang);
    expect(TEMPLATE_PLANS).toHaveLength(d.templates.items.length);
    TEMPLATE_PLANS.forEach((p, i) => {
      expect(Number(d.templates.items[i].length.match(/\d+/)?.[0])).toBe(
        p.days,
      );
      expect(QUOTE_INTEREST[p.tx]).toBe(d.templates.items[i].interest);
    });
  });
