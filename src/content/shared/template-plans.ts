import type { PlanInput } from "@/lib/planner/build-plan";
export const TEMPLATE_PLANS = [
  { tx: "implants", days: 7, pax: 2 },
  { tx: "lasik", days: 5, pax: 2 },
  { tx: "screening", days: 5, pax: 2 },
  { tx: "womens-health", days: 7, pax: 2 },
  { tx: "fertility", days: 10, pax: 2 },
  { tx: "screening", days: 7, pax: 3 },
] as const satisfies readonly PlanInput[];
