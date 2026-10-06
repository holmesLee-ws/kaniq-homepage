import type { Lang } from "@/lib/i18n/langs";
import type { MessengerId } from "./shared/messengers";
import type { PlannerTx, TrackId } from "./shared/planner-data";
import type { Timing, StayPref, ContactMethod } from "@/lib/quote/schema";
export type CareId =
  | "implants"
  | "lasik"
  | "screening"
  | "fertility"
  | "dental"
  | "eye"
  | "womens-wellness"
  | "womens-health"
  | "serious-referral"
  | "student-checkup";
export type QuoteInterest =
  | "screening"
  | "dental"
  | "eye"
  | "womens-health"
  | "fertility";
type T2<T> = readonly [T, T];
type T3<T> = readonly [T, T, T];
type T4<T> = readonly [T, T, T, T];
type T6<T> = readonly [T, T, T, T, T, T];

export type Dictionary = {
  lang: Lang;
  meta: {
    title: string;
    description: string;
    quoteTitle: string;
    quoteDescription: string;
    ogAlt: string;
  };
  previewBand: string; // preview일 때만 렌더
  header: {
    skip: string;
    nav: { care: string; plan: string; refer: string; trust: string };
    language: string;
    phase2Soon: string;
  }; // "Opens in December"
  hero: {
    homeFor: string;
    headline: readonly string[];
    lede: string;
    quoteForPlan: string;
  };
  planner: PlannerCopy;
  care: Record<CareId, string>; // 정식 시술·진료명
  local: {
    title: string;
    priorityTitle: string;
    priorityCare: readonly CareId[];
    specialTitle: string;
    special: string;
    photoAlt: string;
    photoCaption: string;
  };
  messenger: {
    channel: MessengerId;
    chatOn: string /* "Chat on {name}" */;
    opensAtLaunch: string;
  };
  doctorOk: {
    badge: string;
    title: string;
    intro: string;
    caption: string;
    activity: string;
    rows: readonly { activity: string; after: string; okFromDay: number }[]; // 5행, D0~D6
    legendOk: string;
    legendNot: string;
    cellOk: string;
    cellNot: string;
  };
  recovery: {
    title: string;
    intro: string;
    cols: {
      stage: string;
      stay: string;
      see: string;
      eat: string;
      culture: string;
    };
    rows: T4<{
      stage: string;
      note: string;
      stay: string;
      see: string;
      eat: string;
      culture: string;
    }>;
  };
  trust: {
    title: string;
    intro: string;
    sample: string;
    receipt: {
      title: string;
      sub: string;
      rows: T4<{ what: string; who: string; amount: string }>;
      total: string;
      seal: string;
    };
    records: {
      title: string;
      intro: string;
      figureAlt: string;
      figureCaption: string;
      labels: {
        registration: string;
        accreditation: string;
        specialists: string;
        languages: string;
      };
      hospitals: T2<{
        kind: string;
        specialists: string;
        languages: string;
        doctorBio: string;
      }>;
    };
    steps: {
      title: string;
      intro: string;
      items: T4<{ title: string; body: string }>;
    };
  };
  templates: {
    title: string;
    intro: string;
    cta: string;
    items: T6<{
      name: string;
      length: string;
      highlight: string;
      interest: QuoteInterest;
    }>;
  };
  ambassador: {
    title: string;
    intro: string;
    giveLegend: string;
    options: T4<{ label: string; note: string }>;
    signupNote: string;
    preview: {
      title: string;
      sample: string;
      code: string;
      cols: readonly [string, string, string, string, string];
      rows: readonly { name: string; care: string; stage: 1 | 2 | 3 | 4 }[];
      foot: string;
    };
  };
  organizations: {
    title: string;
    intro: string;
    note: string;
    items: T4<{ who: string; what: string }>;
  };
  footer: {
    tagline: string;
    regMedical: string;
    regTravel: string;
    feeTitle: string;
    fee: T3<string>;
    privacyTitle: string;
    privacy: string;
    disputeTitle: string;
    dispute: string;
  };
  msgbar: { previewNote: string };
  quote: QuoteCopy; // §3.4
  live: { replyPromise: string; quoteDone: string }; // ★ "24시간" 표현은 여기에만 둔다. live일 때만 렌더
};
export type PlannerCopy = {
  legend: { treatment: string; days: string; travelers: string };
  pax: { one: string; two: string; group: string };
  title: string;
  subtitle: { one: string; two: string; group: string };
  rooms: { one: string; two: string; group: string };
  dayTitles: {
    arrive: string;
    treatment: string;
    early: string;
    culture: string;
    free: string;
    home: string;
  };
  fixed: {
    pickup: string;
    escort: string;
    finalCheck: string;
    dropoff: string;
  };
  tracks: Record<TrackId, string>;
  badges: { ok: string; from: string; afterDoctor: string; notUntil: string };
  priceLabel: string;
  priceNote: string;
  feeLabel: string;
  photoAlt: string;
  treatments: Record<
    PlannerTx,
    {
      name: string;
      treat: string;
      early: T3<string>;
      mid: T3<string>;
      late: T2<string>;
    }
  >;
};
export type QuoteCopy = {
  title: string;
  intro: string;
  previewNotice: string;
  steps: T3<string>;
  stepOf: string;
  interestLegend: string;
  timingLegend: string;
  timing: Record<Timing, string>;
  pickupLabel: string;
  stayLabel: string;
  stayNone: string;
  stay: Record<StayPref, string>;
  nameLabel: string;
  methodLabel: string;
  method: Record<ContactMethod, string>;
  contactLabel: string;
  residenceLabel: string;
  optional: string;
  privacy: string;
  consentLabel: string;
  next: string;
  back: string;
  submit: string;
  sending: string;
  errors: {
    required: string;
    invalid: string;
    too_long: string;
    network: string;
  };
  doneTitle: string;
  donePreview: string;
  backHome: string;
};
