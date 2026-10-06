import type { Dictionary } from "@/content/types";
import { QuoteStartLink } from "@/components/cta/QuoteStartLink";
export function TemplateList({ dict: d }: { dict: Dictionary }) {
  return (
    <section id="templates" className="section wrap">
      <h2>{d.templates.title}</h2>
      <p className="intro">{d.templates.intro}</p>
      <ul className="tpl">
        {d.templates.items.map((t) => (
          <li key={t.name}>
            <span className="t-name">{t.name}</span>
            <span className="t-len">{t.length}</span>
            <span className="t-hi">
              {t.highlight} · {d.doctorOk.badge}
            </span>
            <QuoteStartLink lang={d.lang} interest={t.interest} variant="text">
              {d.templates.cta}
            </QuoteStartLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
