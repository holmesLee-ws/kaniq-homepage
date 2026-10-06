import type { Dictionary } from "@/content/types";
export function Ambassador({ copy: c }: { copy: Dictionary["ambassador"] }) {
  return (
    <section id="ambassador" className="section wrap">
      <div className="amb">
        <div>
          <h2>{c.title}</h2>
          <p>{c.intro}</p>
          <fieldset>
            <legend>{c.giveLegend}</legend>
            <div className="give">
              {c.options.map((o, i) => (
                <span key={o.label}>
                  <input
                    type="radio"
                    id={"give-" + i}
                    name="give"
                    defaultChecked={i === 0}
                  />
                  <label htmlFor={"give-" + i}>
                    <strong>{o.label}</strong>
                    <small>{o.note}</small>
                  </label>
                </span>
              ))}
            </div>
          </fieldset>
          <p>{c.signupNote}</p>
        </div>
        <div className="ref-preview">
          <h3>{c.preview.title}</h3>
          <span className="sample">{c.preview.sample}</span>
          <p>{c.preview.code}: —</p>
          <table>
            <thead>
              <tr>
                {c.preview.cols.map((t) => (
                  <th key={t} scope="col">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.preview.rows.map((r) => (
                <tr key={r.name}>
                  <th scope="row">
                    {r.name}
                    <small>{r.care}</small>
                  </th>
                  {[1, 2, 3, 4].map((i) => (
                    <td key={i}>
                      <span
                        className={
                          "dot " +
                          (i < r.stage ? "done" : i === r.stage ? "now" : "")
                        }
                      >
                        <span className="sr-only">
                          {c.preview.cols[i]}
                          {i <= r.stage ? " ✓" : " —"}
                        </span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p>{c.preview.foot}</p>
        </div>
      </div>
    </section>
  );
}
