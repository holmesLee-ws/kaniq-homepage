import type { RecoveryDayView } from "@/lib/recovery/recovery-day";
import type { Dictionary } from "@/content/types";
export function DoctorOkRules({
  copy: c,
  view: v,
  onDay,
}: {
  copy: Dictionary["doctorOk"];
  view: RecoveryDayView;
  onDay: (day: number) => void;
}) {
  return (
    <section className="section wrap">
      <div className="okrules">
        <div>
          <span className="badge-big">{c.badge}</span>
          <h2>{c.title}</h2>
          <p className="intro">{c.intro}</p>
        </div>
        <div>
          <div className="scrub">
            <label htmlFor="scrub-day">{c.scrub.label}</label>
            <span className="scrub-now" aria-hidden="true">
              D{v.column}
            </span>
            <input
              id="scrub-day"
              type="range"
              min={0}
              max={6}
              step={1}
              value={v.column}
              aria-valuetext={v.ariaText}
              onChange={(e) => onDay(+e.currentTarget.value)}
              style={{ "--fill": v.column / 6 } as React.CSSProperties}
            />
            <div className="scrub-ticks" aria-hidden="true">
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i}>D{i}</span>
              ))}
            </div>
          </div>
          <div className="rule-scroll">
            <table className="rule-grid">
              <caption>{c.caption}</caption>
              <thead>
                <tr>
                  <th scope="col">{c.activity}</th>
                  {Array.from({ length: 7 }, (_, i) => (
                    <th
                      scope="col"
                      key={i}
                      data-col-on={i === v.column || undefined}
                    >
                      D{i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r, row) => (
                  <tr
                    key={r.activity}
                    data-on={v.activeRuleIds.includes(row) || undefined}
                  >
                    <th scope="row">
                      {r.activity}
                      <span className="sub">{r.after}</span>
                    </th>
                    {Array.from({ length: 7 }, (_, i) => (
                      <td
                        key={i}
                        data-col-on={i === v.column || undefined}
                        className={i >= r.okFromDay ? "y" : "n"}
                      >
                        {i >= r.okFromDay ? (
                          c.cellOk
                        ) : (
                          <span className="sr-only">{c.cellNot}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="legend">
              <span>{c.legendOk}</span>
              <span>{c.legendNot}</span>
            </div>
          </div>
          <div className="today">
            <h3>
              {c.scrub.todayTitle} · D{v.column}
            </h3>
            {v.activeRuleIds.length ? (
              <ul>
                {v.activeRuleIds.map((id, i) => (
                  <li
                    key={`${v.column}-${id}`}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    {c.rows[id].activity}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{c.scrub.todayNone}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
