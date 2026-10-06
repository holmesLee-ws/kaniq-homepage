"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import photo from "../../../public/img/a-samgyetang.jpg";
import type { Lang } from "@/lib/i18n/langs";
import type { PlannerCopy } from "@/content/types";
import {
  buildPlan,
  QUOTE_INTEREST,
  type PlanInput,
  type PlanView,
} from "@/lib/planner/build-plan";
import { QuoteStartLink } from "@/components/cta/QuoteStartLink";
import { usePresence, type Presence } from "@/lib/motion/presence";
export function JourneyPlanner({
  lang,
  copy,
  quoteLabel,
  children,
}: {
  lang: Lang;
  copy: PlannerCopy;
  quoteLabel: string;
  children: React.ReactNode;
}) {
  const [input, setInput] = useState<PlanInput>({
    tx: "implants",
    days: 7,
    pax: 2,
  });
  const [touched, setTouched] = useState(false);
  const change = (next: PlanInput) => {
    setTouched(true);
    setInput(next);
  };
  const plan = useMemo(() => buildPlan(input, copy), [input, copy]);
  const days = usePresence(plan.days, (d) => d.slot);
  const [price, setPrice] = useState({ v: plan.price, rolled: false });
  if (price.v !== plan.price) setPrice({ v: plan.price, rolled: true });
  return (
    <>
      <div>
        {children}
        <form id="planner">
          <fieldset>
            <legend>{copy.legend.treatment}</legend>
            <div className="chips">
              {(Object.keys(copy.treatments) as PlanInput["tx"][]).map((tx) => (
                <span key={tx}>
                  <input
                    type="radio"
                    name="tx"
                    id={"tx-" + tx}
                    value={tx}
                    checked={input.tx === tx}
                    onChange={() => change({ ...input, tx })}
                  />
                  <label htmlFor={"tx-" + tx}>{copy.treatments[tx].name}</label>
                </span>
              ))}
            </div>
          </fieldset>
          <div className="inline-sets">
            <fieldset>
              <legend>{copy.legend.days}</legend>
              <div className="chips">
                {([5, 7, 10] as const).map((days) => (
                  <span key={days}>
                    <input
                      type="radio"
                      id={"days-" + days}
                      name="days"
                      checked={input.days === days}
                      onChange={() => change({ ...input, days })}
                    />
                    <label htmlFor={"days-" + days}>{days}</label>
                  </span>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>{copy.legend.travelers}</legend>
              <div className="chips">
                {([1, 2, 3] as const).map((pax) => (
                  <span key={pax}>
                    <input
                      type="radio"
                      id={"pax-" + pax}
                      name="pax"
                      checked={input.pax === pax}
                      onChange={() => change({ ...input, pax })}
                    />
                    <label htmlFor={"pax-" + pax}>
                      {
                        copy.pax[
                          pax === 1 ? "one" : pax === 2 ? "two" : "group"
                        ]
                      }
                    </label>
                  </span>
                ))}
              </div>
            </fieldset>
          </div>
        </form>
        <QuoteStartLink lang={lang} interest={QUOTE_INTEREST[input.tx]}>
          {quoteLabel}
        </QuoteStartLink>
      </div>
      <article
        className="plan"
        id="plan-card"
        data-intro={touched ? undefined : ""}
      >
        <header className="plan-top">
          <div aria-live="polite" aria-atomic="true">
            <h2 id="plan-title">{plan.title}</h2>
            <p id="plan-sub">{plan.subtitle}</p>
          </div>
          <Image
            className="plan-photo"
            src={photo}
            alt={copy.photoAlt}
            sizes="96px"
          />
        </header>
        <ol className="days">
          {days.map((p, i) => (
            <PlanDay key={p.key} presence={p} index={i} />
          ))}
        </ol>
        <footer className="plan-foot">
          <span>
            {copy.priceLabel}{" "}
            <strong id="price">
              <span key={price.v} data-roll={price.rolled ? "" : undefined}>
                {price.v}
              </span>
            </strong>
            <small>{copy.priceNote}</small>
          </span>
          <span>
            {copy.feeLabel} <strong>₩0</strong>
          </span>
        </footer>
      </article>
    </>
  );
}

function PlanDay({
  presence: p,
  index,
}: {
  presence: Presence<PlanView["days"][number]>;
  index: number;
}) {
  const day = p.item;
  const label = useMemo(() => [day.label], [day.label]);
  const labels = usePresence(label, (s) => s);
  const items = usePresence(day.items, (item) => item.track + "|" + item.text);
  return (
    <li
      className={"day" + (day.treat ? " is-treat" : "")}
      data-presence={p.state}
      aria-hidden={p.state === "exit" || undefined}
      inert={p.state === "exit"}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="day-label">
        {labels.map((l) => (
          <span
            key={l.key}
            data-presence={l.state}
            aria-hidden={l.state === "exit" || undefined}
            inert={l.state === "exit"}
          >
            {l.item}
          </span>
        ))}
      </div>
      <div>
        <h3>{day.title}</h3>
        <ul className="items">
          {items.map(({ key, item, state }) => (
            <li
              className="item"
              key={key}
              data-presence={state}
              aria-hidden={state === "exit" || undefined}
              inert={state === "exit"}
            >
              <span className="track" data-t={item.track}>
                {item.trackLabel}
              </span>
              <span>{item.text}</span>
              {item.badge ? (
                <span className={"okbadge" + (item.badge.wait ? " wait" : "")}>
                  {item.badge.text}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
