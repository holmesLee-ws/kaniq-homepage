import { it, expect } from "vitest";
import { LANGS } from "@/lib/i18n/langs";
import { getDictionary } from "@/content";
import { recoveryDay } from "@/lib/recovery/recovery-day";
for (const lang of LANGS)
  for (let day = 0; day <= 6; day++)
    it(`${lang} recovery day ${day}`, () => {
      const d = getDictionary(lang),
        v = recoveryDay(day, d.doctorOk.rows, d.recovery.rows);
      const row = [0, 1, 1, 2, 2, 2, 3][day];
      expect(v.column).toBe(day);
      expect(v.rowIndex).toBe(row);
      expect(v.ariaText).toBe(`D${day} — ${d.recovery.rows[row].note}`);
      expect(v.activeRuleIds).toEqual(
        d.doctorOk.rows.flatMap((r, i) => (day >= r.okFromDay ? [i] : [])),
      );
    });
it("rounds and clamps boundaries", () => {
  const d = getDictionary("en");
  expect(
    [-1, 7, 2.6].map(
      (n) => recoveryDay(n, d.doctorOk.rows, d.recovery.rows).column,
    ),
  ).toEqual([0, 6, 3]);
});
