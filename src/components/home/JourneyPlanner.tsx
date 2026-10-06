"use client";
import { useState } from "react";
import Image from "next/image";
import photo from "../../../public/img/a-samgyetang.jpg";
import type { Lang } from "@/lib/i18n/langs";
import type { PlannerCopy } from "@/content/types";
import {
  buildPlan,
  QUOTE_INTEREST,
  type PlanInput,
} from "@/lib/planner/build-plan";
import { QuoteStartLink } from "@/components/cta/QuoteStartLink";
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
  const plan = buildPlan(input, copy);
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
                    onChange={() => setInput({ ...input, tx })}
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
                      onChange={() => setInput({ ...input, days })}
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
                      onChange={() => setInput({ ...input, pax })}
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
      <article className="plan updating" id="plan-card">
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
        <ol className="days" key={`${input.tx}-${input.days}-${input.pax}`}>
          {plan.days.map((day) => (
            <li
              className={"day" + (day.treat ? " is-treat" : "")}
              key={day.label}
            >
              <div className="day-label">
                <span>{day.label}</span>
              </div>
              <div>
                <h3>{day.title}</h3>
                <ul className="items">
                  {day.items.map((item, i) => (
                    <li className="item" key={i}>
                      <span className="track" data-t={item.track}>
                        {item.trackLabel}
                      </span>
                      <span>{item.text}</span>
                      {item.badge ? (
                        <span
                          className={
                            "okbadge" + (item.badge.wait ? " wait" : "")
                          }
                        >
                          {item.badge.text}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <footer className="plan-foot">
          <span>
            {copy.priceLabel} <strong id="price">{plan.price}</strong>
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
