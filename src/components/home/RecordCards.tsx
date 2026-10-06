import Image from "next/image";
import photo from "../../../public/img/b-consult.jpg";
import { RECORDS } from "@/content/shared/records";
import type { Dictionary } from "@/content/types";
export function RecordCards({ dict: d }: { dict: Dictionary }) {
  const c = d.trust.records;
  return (
    <section className="section">
      <h2>{c.title}</h2>
      <p className="intro">{c.intro}</p>
      <div className="split registry">
        <figure>
          <Image
            src={photo}
            alt={c.figureAlt}
            sizes="(max-width:860px) 100vw, 45vw"
          />
          <figcaption>{c.figureCaption}</figcaption>
        </figure>
        <div>
          {RECORDS.map((r, i) => (
            <article className="record" key={r.registration}>
              <header>
                <h3>{d.lang === "ko" ? r.nameKo : r.nameLatin}</h3>
                <span className="sample">{d.trust.sample}</span>
              </header>
              <p>{c.hospitals[i].kind}</p>
              <dl>
                {Object.entries(c.labels).map(([k, t]) => (
                  <div key={k}>
                    <dt>{t}</dt>
                    <dd>
                      {k === "languages"
                        ? c.hospitals[i].languages
                        : k === "specialists"
                          ? c.hospitals[i].specialists
                          : r[k as "registration" | "accreditation"]}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="doctor">
                <span className="mono" aria-hidden="true">
                  {r.mono}
                </span>
                <div>
                  <strong>
                    {d.lang === "ko" ? r.doctorKo : r.doctorLatin}
                  </strong>{" "}
                  <span className="sample">{d.trust.sample}</span>
                  <p>{c.hospitals[i].doctorBio}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
