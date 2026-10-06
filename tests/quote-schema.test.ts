import { it, expect } from "vitest";
import { validateQuote, validateStep } from "@/lib/quote/schema";
const valid = {
  lang: "ja",
  interest: "dental",
  timing: "not-sure",
  name: " Test ",
  contactMethod: "email",
  contact: "t@example.com",
  consent: true,
};
it("valid input is trimmed, unknown keys removed, optional fields absent", () => {
  const r = validateQuote({ ...valid, secret: "discard" });
  expect(r.ok).toBe(true);
  if (r.ok) {
    expect(r.value.name).toBe("Test");
    expect(r.value).not.toHaveProperty("secret");
    expect(r.value).not.toHaveProperty("stay");
  }
});
it.each([
  "lang",
  "interest",
  "timing",
  "name",
  "contactMethod",
  "contact",
  "consent",
])("requires %s", (field) => {
  const r = validateQuote({ ...valid, [field]: undefined });
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.errors).toContainEqual({ field, code: "required" });
});
it.each([
  ["lang", "fr", "invalid"],
  ["interest", "implants", "invalid"],
  ["timing", "now", "invalid"],
  ["name", "a".repeat(81), "too_long"],
  ["contact", "abc", "invalid"],
  ["contactMethod", "sms", "invalid"],
  ["consent", false, "required"],
  ["consent", "true", "invalid"],
  ["pickup", "yes", "invalid"],
  ["stay", "other", "invalid"],
  ["residence", "a".repeat(81), "too_long"],
])("rejects %s", (field, value, code) => {
  const r = validateQuote({ ...valid, [field]: value });
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.errors).toContainEqual({ field, code });
});
it("steps validate only their own fields", () => {
  expect(validateStep(1, {})).toEqual([
    { field: "interest", code: "required" },
  ]);
  expect(validateStep(2, { timing: "not-sure" })).toEqual([]);
  expect(validateQuote(null).ok).toBe(false);
});
