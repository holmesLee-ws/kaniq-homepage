import {
  PLANNER_DATA,
  type PlannerTx,
  type TrackId,
  type Slot,
} from "@/content/shared/planner-data";
import type { PlannerCopy, QuoteInterest } from "@/content/types";
export type PlanInput = { tx: PlannerTx; days: 5 | 7 | 10; pax: 1 | 2 | 3 };
export type PlanView = {
  title: string;
  subtitle: string;
  price: string;
  days: {
    slot: "arrive" | "treat" | "early" | "culture" | "free" | "home";
    label: string;
    title: string;
    treat: boolean;
    items: {
      track: TrackId;
      trackLabel: string;
      text: string;
      badge: null | { text: string; wait: boolean };
    }[];
  }[];
};
export const QUOTE_INTEREST: Record<PlannerTx, QuoteInterest> = {
  implants: "dental",
  lasik: "eye",
  screening: "screening",
  "womens-health": "womens-health",
  fertility: "fertility",
};
export function buildPlan(
  input: PlanInput,
  copy: PlannerCopy,
  data = PLANNER_DATA,
): PlanView {
  const { tx, days, pax } = input;
  const t = copy.treatments[tx];
  const rules = data[tx];
  const who = pax === 1 ? "one" : pax === 2 ? "two" : "group";
  const fixed = (track: TrackId, text: string) => ({
    track,
    trackLabel: copy.tracks[track],
    text,
    badge: null,
  });
  const item = (slot: Slot, text: string) => {
    const b = slot.badge;
    return {
      track: slot.track,
      trackLabel: copy.tracks[slot.track],
      text,
      badge:
        b.kind === "none"
          ? null
          : {
              text:
                b.kind === "ok"
                  ? copy.badges.ok
                  : b.kind === "after-doctor"
                    ? copy.badges.afterDoctor
                    : (b.kind === "from"
                        ? copy.badges.from
                        : copy.badges.notUntil
                      ).replace("{n}", String(b.day)),
              wait: b.kind === "after-doctor" || b.kind === "not-until",
            },
    };
  };
  const period = (p: "early" | "mid" | "late") =>
    rules[p].map((s, i) => item(s, t[p][i]));
  const rows: PlanView["days"] = [
    {
      slot: "arrive",
      label: "D-1",
      title: copy.dayTitles.arrive,
      treat: false,
      items: [fixed("Move", copy.fixed.pickup), fixed("Stay", copy.rooms[who])],
    },
    {
      slot: "treat",
      label: "D0",
      title: copy.dayTitles.treatment,
      treat: true,
      items: [fixed("Treat", t.treat), fixed("Move", copy.fixed.escort)],
    },
    {
      slot: "early",
      label: "D1–2",
      title: copy.dayTitles.early,
      treat: false,
      items: period("early"),
    },
    {
      slot: "culture",
      label: days === 5 ? "D3" : "D3–5",
      title: copy.dayTitles.culture,
      treat: false,
      items: days === 5 ? period("mid").slice(0, 2) : period("mid"),
    },
  ];
  if (days === 10)
    rows.push({
      slot: "free",
      label: "D6–8",
      title: copy.dayTitles.free,
      treat: false,
      items: period("late"),
    });
  rows.push({
    slot: "home",
    label: days === 5 ? "D4" : days === 7 ? "D6" : "D9",
    title: copy.dayTitles.home,
    treat: false,
    items: [
      fixed("Treat", copy.fixed.finalCheck),
      fixed("Move", copy.fixed.dropoff),
    ],
  });
  return {
    title: copy.title.replace("{name}", t.name).replace("{n}", String(days)),
    subtitle: copy.subtitle[who],
    price: rules.price,
    days: rows,
  };
}
