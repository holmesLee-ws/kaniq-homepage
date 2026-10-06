import { describe, it, expect } from "vitest";
import { LANGS } from "@/lib/i18n/langs";
import { getDictionary } from "@/content";
import { buildPlan, QUOTE_INTEREST } from "@/lib/planner/build-plan";
import { PLANNER_DATA, type PlannerTx } from "@/content/shared/planner-data";
for (const lang of LANGS)
  describe(lang, () => {
    const copy = getDictionary(lang).planner;
    it("treatment changes title, activities and price while retaining days", () => {
      const plans = (Object.keys(PLANNER_DATA) as PlannerTx[]).map((tx) =>
        buildPlan({ tx, days: 7, pax: 2 }, copy),
      );
      expect(new Set(plans.map((p) => p.title)).size).toBe(5);
      expect(new Set(plans.map((p) => p.price)).size).toBe(5);
      expect(
        new Set(
          plans.map((p) =>
            JSON.stringify(p.days.map((d) => d.items.map((i) => i.text))),
          ),
        ).size,
      ).toBe(5);
      for (const p of plans)
        expect(p.days.map((d) => d.label)).toEqual(
          plans[0].days.map((d) => d.label),
        );
    });
    it("days change skeleton but retain price", () => {
      const plans = ([5, 7, 10] as const).map((days) =>
        buildPlan({ tx: "implants", days, pax: 2 }, copy),
      );
      expect(plans.map((p) => p.days.map((d) => d.label))).toEqual([
        ["D-1", "D0", "D1–2", "D3", "D4"],
        ["D-1", "D0", "D1–2", "D3–5", "D6"],
        ["D-1", "D0", "D1–2", "D3–5", "D6–8", "D9"],
      ]);
      expect(new Set(plans.map((p) => p.price)).size).toBe(1);
      expect(new Set(plans.map((p) => p.title)).size).toBe(3);
    });
    it("travelers change subtitle and accommodation only", () => {
      const plans = ([1, 2, 3] as const).map((pax) =>
        buildPlan({ tx: "implants", days: 7, pax }, copy),
      );
      expect(new Set(plans.map((p) => p.subtitle)).size).toBe(3);
      expect(new Set(plans.map((p) => p.days[0].items[1].text)).size).toBe(3);
      for (const p of plans) {
        expect(p.price).toBe(plans[0].price);
        expect(p.days.slice(1)).toEqual(plans[0].days.slice(1));
      }
    });
    it("all eligible activities carry correctly classified badges", () => {
      for (const tx of Object.keys(PLANNER_DATA) as PlannerTx[]) {
        const p = buildPlan({ tx, days: 10, pax: 2 }, copy);
        for (const day of p.days.slice(2, -1))
          for (const item of day.items)
            if (item.track !== "Treat") expect(item.badge).not.toBeNull();
        for (const period of ["early", "mid", "late"] as const) {
          expect(copy.treatments[tx][period].length).toBe(
            PLANNER_DATA[tx][period].length,
          );
          PLANNER_DATA[tx][period].forEach((slot, i) => {
            if (
              slot.badge.kind === "after-doctor" ||
              slot.badge.kind === "not-until"
            )
              expect(
                p.days[{ early: 2, mid: 3, late: 4 }[period]].items[i].badge
                  ?.wait,
              ).toBe(true);
          });
        }
      }
      expect(QUOTE_INTEREST.implants).toBe("dental");
      expect(QUOTE_INTEREST.lasik).toBe("eye");
    });
  });

it("keeps stable day slots across duration choices", () => {
  for (const days of [5, 7, 10] as const) {
    const plan = buildPlan(
      { tx: "implants", days, pax: 2 },
      getDictionary("en").planner,
    );
    expect(plan.days.map((d) => d.slot)).toEqual(
      days === 10
        ? ["arrive", "treat", "early", "culture", "free", "home"]
        : ["arrive", "treat", "early", "culture", "home"],
    );
  }
});
