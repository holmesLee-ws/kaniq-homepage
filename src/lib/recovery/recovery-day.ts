import type { Dictionary } from "@/content/types";
export type RecoveryDayView = {
  column: number;
  activeRuleIds: number[];
  rowIndex: 0 | 1 | 2 | 3;
  ariaText: string;
};
export function recoveryDay(
  day: number,
  rules: Dictionary["doctorOk"]["rows"],
  rows: Dictionary["recovery"]["rows"],
): RecoveryDayView {
  const column = Math.max(0, Math.min(6, Math.round(day)));
  const rowIndex = column === 0 ? 0 : column <= 2 ? 1 : column <= 5 ? 2 : 3;
  return {
    column,
    rowIndex,
    activeRuleIds: rules.flatMap((r, i) => (column >= r.okFromDay ? [i] : [])),
    ariaText: `D${column} — ${rows[rowIndex].note}`,
  };
}
