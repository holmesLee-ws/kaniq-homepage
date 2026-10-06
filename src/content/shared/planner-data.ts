export type PlannerTx =
  | "implants"
  | "lasik"
  | "screening"
  | "womens-health"
  | "fertility";
export type TrackId = "Move" | "Stay" | "Treat" | "Taste" | "Feel" | "See";
export type BadgeRule =
  | { kind: "ok" }
  | { kind: "after-doctor" }
  | { kind: "none" }
  | { kind: "from" | "not-until"; day: number };
export type Slot = { track: TrackId; badge: BadgeRule };
export const PLANNER_DATA: Record<
  PlannerTx,
  {
    price: string;
    early: readonly Slot[];
    mid: readonly Slot[];
    late: readonly Slot[];
  }
> = {
  implants: {
    price: "₩2.4M–3.2M",
    early: [
      {
        track: "Taste",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "See",
        badge: {
          kind: "ok",
        },
      },
    ],
    mid: [
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Taste",
        badge: {
          kind: "from",
          day: 3,
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "from",
          day: 3,
        },
      },
    ],
    late: [
      {
        track: "Feel",
        badge: {
          kind: "from",
          day: 2,
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "from",
          day: 4,
        },
      },
    ],
  },
  lasik: {
    price: "₩1.6M–2.4M",
    early: [
      {
        track: "Stay",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Taste",
        badge: {
          kind: "ok",
        },
      },
    ],
    mid: [
      {
        track: "See",
        badge: {
          kind: "from",
          day: 2,
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "from",
          day: 3,
        },
      },
    ],
    late: [
      {
        track: "Feel",
        badge: {
          kind: "from",
          day: 7,
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "not-until",
          day: 14,
        },
      },
    ],
  },
  screening: {
    price: "₩0.5M–1.5M",
    early: [
      {
        track: "Taste",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "See",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
    ],
    mid: [
      {
        track: "Treat",
        badge: {
          kind: "none",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "See",
        badge: {
          kind: "ok",
        },
      },
    ],
    late: [
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
    ],
  },
  "womens-health": {
    price: "₩3.0M–5.0M",
    early: [
      {
        track: "Stay",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Taste",
        badge: {
          kind: "ok",
        },
      },
    ],
    mid: [
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "after-doctor",
        },
      },
    ],
    late: [
      {
        track: "Feel",
        badge: {
          kind: "after-doctor",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "after-doctor",
        },
      },
    ],
  },
  fertility: {
    price: "₩0.8M–1.5M",
    early: [
      {
        track: "Stay",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "See",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Taste",
        badge: {
          kind: "ok",
        },
      },
    ],
    mid: [
      {
        track: "Treat",
        badge: {
          kind: "none",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
    ],
    late: [
      {
        track: "Feel",
        badge: {
          kind: "ok",
        },
      },
      {
        track: "Feel",
        badge: {
          kind: "after-doctor",
        },
      },
    ],
  },
};
