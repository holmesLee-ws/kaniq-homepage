import type { Dictionary } from "@/content/types";
export function RecoveryWeek({
  copy: c,
  activeRow,
}: {
  copy: Dictionary["recovery"];
  activeRow: number;
}) {
  return (
    <section className="section wrap recovery">
      <h2>{c.title}</h2>
      <p className="intro">{c.intro}</p>
      <table className="matrix">
        <thead>
          <tr>
            {Object.entries(c.cols).map(([k, t]) => (
              <th scope="col" key={k}>
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {c.rows.map((r, i) => (
            <tr
              key={r.stage}
              data-active={i === activeRow || undefined}
              aria-current={i === activeRow ? "true" : undefined}
            >
              <th scope="row" className="stage">
                {r.stage}
                <small>{r.note}</small>
              </th>
              {(["stay", "see", "eat", "culture"] as const).map((k) => (
                <td key={k} data-col={c.cols[k]}>
                  {r[k]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
