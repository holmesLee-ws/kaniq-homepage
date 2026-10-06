"use client";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Lang } from "@/lib/i18n/langs";
import type { Dictionary, QuoteCopy } from "@/content/types";
import {
  INTERESTS,
  STEP_FIELDS,
  validateQuote,
  validateStep,
  type FieldError,
  type QuoteInput,
} from "@/lib/quote/schema";

export function QuoteForm({
  lang,
  copy: c,
  care,
  notice,
  doneText,
}: {
  lang: Lang;
  copy: QuoteCopy;
  care: Dictionary["care"];
  notice: string | null;
  doneText: string;
}) {
  const params = useSearchParams();
  const [draft, setDraft] = useState<
    Partial<Record<keyof QuoteInput, unknown>>
  >(() => ({
    lang,
    contactMethod: "email",
    ...(INTERESTS.includes(params.get("interest") as (typeof INTERESTS)[number])
      ? { interest: params.get("interest") }
      : {}),
  }));
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [network, setNetwork] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const update = (field: keyof QuoteInput, value: unknown) => {
    setDraft((d) => ({ ...d, [field]: value }));
    setErrors((e) => e.filter((x) => x.field !== field));
    setNetwork(false);
  };
  const focusHeading = () =>
    requestAnimationFrame(() => heading.current?.focus());
  const showErrors = (list: FieldError[]) => {
    setErrors(list);
    requestAnimationFrame(() => {
      const first = list[0];
      if (first)
        form.current
          ?.querySelector<HTMLElement>(`[name="${first.field}"]`)
          ?.focus();
    });
  };
  const error = (field: FieldError["field"]) =>
    errors.find((e) => e.field === field);
  const errorText = (field: FieldError["field"]) => {
    const e = error(field);
    return e ? (
      <p className="error" id={"error-" + field} role="alert">
        {c.errors[e.code]}
      </p>
    ) : null;
  };
  const invalid = (field: FieldError["field"]) => ({
    "aria-invalid": error(field) ? true : undefined,
    "aria-describedby": error(field) ? "error-" + field : undefined,
  });
  const go = (n: 1 | 2 | 3) => {
    setStep(n);
    setErrors([]);
    setNetwork(false);
    focusHeading();
  };
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const list = validateStep(step, draft);
    if (list.length) {
      showErrors(list);
      return;
    }
    if (step < 3) {
      go((step + 1) as 2 | 3);
      return;
    }
    const parsed = validateQuote(draft);
    if (!parsed.ok) {
      showErrors(parsed.errors);
      return;
    }
    setSending(true);
    setNetwork(false);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.value),
      });
      if (response.ok) {
        setDone(true);
        setDraft({ lang });
        focusHeading();
      } else if (response.status === 422) {
        const result = (await response.json()) as { errors: FieldError[] };
        const list = result.errors;
        const target = ([1, 2, 3] as const).find((n) =>
          list.some((e) =>
            (STEP_FIELDS[n] as readonly string[]).includes(e.field),
          ),
        );
        if (target) setStep(target);
        showErrors(list);
      } else setNetwork(true);
    } catch {
      setNetwork(true);
    } finally {
      setSending(false);
    }
  }
  if (done)
    return (
      <section className="quote-card" data-done="true">
        <h2 ref={heading} tabIndex={-1}>
          {c.doneTitle}
        </h2>
        {notice ? <p className="notice">{notice}</p> : null}
        <p>{doneText}</p>
        <a href={"/" + lang}>{c.backHome}</a>
      </section>
    );
  return (
    <section className="quote-card">
      {notice ? <p className="notice">{notice}</p> : null}
      <ol className="stepper">
        {c.steps.map((s, i) => (
          <li key={s} aria-current={i + 1 === step ? "step" : undefined}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>
      <h2 ref={heading} tabIndex={-1}>
        {c.stepOf.replace("{n}", String(step))} · {c.steps[step - 1]}
      </h2>
      <form noValidate ref={form} onSubmit={submit}>
        {step === 1 ? (
          <fieldset {...invalid("interest")}>
            <legend>{c.interestLegend}</legend>
            <div className="chips">
              {INTERESTS.map((id) => (
                <span key={id}>
                  <input
                    name="interest"
                    type="radio"
                    id={"interest-" + id}
                    checked={draft.interest === id}
                    onChange={() => update("interest", id)}
                    {...invalid("interest")}
                  />
                  <label htmlFor={"interest-" + id}>{care[id]}</label>
                </span>
              ))}
            </div>
            {errorText("interest")}
          </fieldset>
        ) : null}
        {step === 2 ? (
          <>
            <fieldset {...invalid("timing")}>
              <legend>{c.timingLegend}</legend>
              {Object.entries(c.timing).map(([id, label]) => (
                <label className="radio-line" key={id}>
                  <input
                    type="radio"
                    name="timing"
                    checked={draft.timing === id}
                    onChange={() => update("timing", id)}
                    {...invalid("timing")}
                  />
                  {label}
                </label>
              ))}
              {errorText("timing")}
            </fieldset>
            <label className="radio-line">
              <input
                type="checkbox"
                name="pickup"
                checked={draft.pickup === true}
                onChange={(e) => update("pickup", e.target.checked)}
              />
              {c.pickupLabel} ({c.optional})
            </label>
            <label className="field">
              {c.stayLabel} ({c.optional})
              <select
                name="stay"
                value={String(draft.stay ?? "")}
                onChange={(e) => update("stay", e.target.value || undefined)}
              >
                <option value="">{c.stayNone}</option>
                {Object.entries(c.stay).map(([id, label]) => (
                  <option value={id} key={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <label className="field">
              {c.nameLabel}
              <input
                name="name"
                autoComplete="name"
                value={String(draft.name ?? "")}
                onChange={(e) => update("name", e.target.value)}
                {...invalid("name")}
              />
              {errorText("name")}
            </label>
            <label className="field">
              {c.methodLabel}
              <select
                name="contactMethod"
                value={String(draft.contactMethod ?? "email")}
                onChange={(e) => update("contactMethod", e.target.value)}
              >
                {Object.entries(c.method).map(([id, label]) => (
                  <option value={id} key={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              {c.contactLabel}
              <input
                name="contact"
                autoComplete={draft.contactMethod === "email" ? "email" : "off"}
                type={draft.contactMethod === "email" ? "email" : "text"}
                value={String(draft.contact ?? "")}
                onChange={(e) => update("contact", e.target.value)}
                {...invalid("contact")}
              />
              {errorText("contact")}
            </label>
            <label className="field">
              {c.residenceLabel} ({c.optional})
              <input
                name="residence"
                autoComplete="country-name"
                value={String(draft.residence ?? "")}
                onChange={(e) => update("residence", e.target.value)}
                {...invalid("residence")}
              />
              {errorText("residence")}
            </label>
            <p id="privacy">{c.privacy}</p>
            <label className="radio-line">
              <input
                type="checkbox"
                name="consent"
                checked={draft.consent === true}
                onChange={(e) => update("consent", e.target.checked)}
                {...invalid("consent")}
              />
              {c.consentLabel}
            </label>
            {errorText("consent")}
          </>
        ) : null}
        {network ? (
          <p className="error" role="alert">
            {c.errors.network}
          </p>
        ) : null}
        <div className="form-actions">
          {step > 1 ? (
            <button
              type="button"
              className="form-btn quiet"
              disabled={sending}
              onClick={() => go((step - 1) as 1 | 2)}
            >
              {c.back}
            </button>
          ) : null}
          <button type="submit" className="form-btn" disabled={sending}>
            {sending ? c.sending : step === 3 ? c.submit : c.next}
          </button>
        </div>
      </form>
    </section>
  );
}
