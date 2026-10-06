import type { Dictionary } from "@/content/types";
import { JourneyPlanner } from "./JourneyPlanner";
export function Hero({ dict: d }: { dict: Dictionary }) {
  return (
    <section id="plan" className="hero wrap">
      <JourneyPlanner
        lang={d.lang}
        copy={d.planner}
        quoteLabel={d.hero.quoteForPlan}
      >
        <p className="eyebrow">{d.hero.homeFor}</p>
        <h1>
          {d.hero.headline.map((s, i) => (
            <span key={s}>
              {i > 0 ? <br /> : null}
              {s}
            </span>
          ))}
        </h1>
        <p className="lede">{d.hero.lede}</p>
      </JourneyPlanner>
    </section>
  );
}
