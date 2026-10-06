import { TEMPLATE_PLANS } from "@/content/shared/template-plans";
import { buildPlan } from "@/lib/planner/build-plan";
import type { Dictionary } from "@/content/types";
import { QuoteStartLink } from "@/components/cta/QuoteStartLink";
export function TemplateList({ dict: d }: { dict: Dictionary }) {
  return (
    <section id="templates" className="section wrap">
      <h2>{d.templates.title}</h2>
      <p className="intro">{d.templates.intro}</p>
      <ul className="tpl">
        {d.templates.items.map((t, i) => (
          <li key={t.name}>
            <span className="t-name">{t.name}</span>
            <span className="t-len">{t.length}</span>
            <span className="t-hi">
              {t.highlight} · {d.doctorOk.badge}
            </span>
            <QuoteStartLink
              lang={d.lang}
              interest={t.interest}
              variant="text"
              describedBy={"tpl-mini-" + i}
            >
              {d.templates.cta}
            </QuoteStartLink>
            <ol className="tpl-mini" id={"tpl-mini-" + i}>
              {buildPlan(TEMPLATE_PLANS[i], d.planner).days.map((day, j) => (
                <li key={day.slot} style={{ "--i": j } as React.CSSProperties}>
                  <b>{day.label}</b> {day.title}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </section>
  );
}
