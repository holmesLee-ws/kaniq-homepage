import type { Dictionary } from "@/content/types";
export function RecoveryWeek({ copy: c }: { copy: Dictionary["recovery"] }) {
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
          {c.rows.map((r) => (
            <tr key={r.stage}>
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
