import { isLang, type Lang } from "@/lib/i18n/langs";
import type { QuoteInterest } from "@/content/types";
export type Timing = "within-3-months" | "3-6-months" | "not-sure";
export type StayPref = "near-hospital" | "hanok" | "family-residence";
export type ContactMethod =
  | "email"
  | "whatsapp"
  | "line"
  | "messenger"
  | "kakaotalk";
export type QuoteInput = {
  lang: Lang;
  interest: QuoteInterest;
  timing: Timing;
  pickup?: boolean;
  stay?: StayPref;
  name: string;
  contactMethod: ContactMethod;
  contact: string;
  residence?: string;
  consent: true;
};
export type FieldError = {
  field: keyof QuoteInput | "_body";
  code: "required" | "invalid" | "too_long";
};
export const INTERESTS = [
  "screening",
  "dental",
  "eye",
  "womens-health",
  "fertility",
] as const;
export const STEP_FIELDS = {
  1: ["interest"],
  2: ["timing", "pickup", "stay"],
  3: ["name", "contactMethod", "contact", "residence", "consent"],
} as const;
export function validateQuote(
  input: unknown,
): { ok: true; value: QuoteInput } | { ok: false; errors: FieldError[] } {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { ok: false, errors: [{ field: "_body", code: "invalid" }] };
  const d = input as Record<string, unknown>;
  const errors: FieldError[] = [];
  const add = (field: FieldError["field"], code: FieldError["code"]) =>
    errors.push({ field, code });
  const enumField = (field: FieldError["field"], values: readonly string[]) => {
    if (d[field] === undefined || d[field] === "") add(field, "required");
    else if (
      typeof d[field] !== "string" ||
      !values.includes(d[field] as string)
    )
      add(field, "invalid");
  };
  if (d.lang === undefined) add("lang", "required");
  else if (typeof d.lang !== "string" || !isLang(d.lang))
    add("lang", "invalid");
  enumField("interest", INTERESTS);
  enumField("timing", ["within-3-months", "3-6-months", "not-sure"]);
  enumField("contactMethod", [
    "email",
    "whatsapp",
    "line",
    "messenger",
    "kakaotalk",
  ]);
  for (const [field, min, max] of [
    ["name", 1, 80],
    ["contact", 3, 120],
    ["residence", 0, 80],
  ] as const) {
    const v = d[field];
    if (v === undefined) {
      if (min) add(field, "required");
    } else if (typeof v !== "string") add(field, "invalid");
    else if (v.trim().length < min)
      add(field, v.trim().length === 0 ? "required" : "invalid");
    else if (v.trim().length > max) add(field, "too_long");
  }
  if (
    d.contactMethod === "email" &&
    typeof d.contact === "string" &&
    d.contact.trim().length >= 3 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact.trim())
  )
    add("contact", "invalid");
  if (d.consent !== true)
    add(
      "consent",
      d.consent === undefined || d.consent === false ? "required" : "invalid",
    );
  if (d.pickup !== undefined && typeof d.pickup !== "boolean")
    add("pickup", "invalid");
  if (
    d.stay !== undefined &&
    !["near-hospital", "hanok", "family-residence"].includes(d.stay as string)
  )
    add("stay", "invalid");
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      lang: d.lang as Lang,
      interest: d.interest as QuoteInterest,
      timing: d.timing as Timing,
      name: (d.name as string).trim(),
      contactMethod: d.contactMethod as ContactMethod,
      contact: (d.contact as string).trim(),
      consent: true,
      ...(d.pickup !== undefined ? { pickup: d.pickup as boolean } : {}),
      ...(d.stay !== undefined ? { stay: d.stay as StayPref } : {}),
      ...(d.residence !== undefined
        ? { residence: (d.residence as string).trim() }
        : {}),
    },
  };
}
export function validateStep(
  step: 1 | 2 | 3,
  draft: Partial<Record<string, unknown>>,
): FieldError[] {
  const r = validateQuote(draft);
  return r.ok
    ? []
    : r.errors.filter((e) =>
        (STEP_FIELDS[step] as readonly string[]).includes(e.field),
      );
}
