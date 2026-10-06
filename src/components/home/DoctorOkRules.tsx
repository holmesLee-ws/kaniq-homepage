import type { Dictionary } from "@/content/types";
export function DoctorOkRules({ copy: c }: { copy: Dictionary["doctorOk"] }) {
  return (
    <section className="section wrap">
      <div className="okrules">
        <div>
          <span className="badge-big">{c.badge}</span>
          <h2>{c.title}</h2>
          <p className="intro">{c.intro}</p>
        </div>
        <div className="rule-scroll">
          <table className="rule-grid">
            <caption>{c.caption}</caption>
            <thead>
              <tr>
                <th scope="col">{c.activity}</th>
                {Array.from({ length: 7 }, (_, i) => (
                  <th scope="col" key={i}>
                    D{i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.activity}>
                  <th scope="row">
                    {r.activity}
                    <span className="sub">{r.after}</span>
                  </th>
                  {Array.from({ length: 7 }, (_, i) => (
                    <td key={i} className={i >= r.okFromDay ? "y" : "n"}>
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
      </div>
    </section>
  );
}
