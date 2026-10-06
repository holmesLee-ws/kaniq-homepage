import type { Dictionary } from "@/content/types";
export function TrustReceipt({
  copy: c,
}: {
  copy: Dictionary["trust"]["receipt"];
}) {
  return (
    <div className="receipt-wrap">
      <svg className="rosette" viewBox="-100 -100 200 200" aria-hidden="true">
        {Array.from({ length: 60 }, (_, i) => (
          <ellipse
            key={i}
            rx={i < 36 ? 88 : 65}
            ry={i < 36 ? 26 : 18}
            transform={`rotate(${i < 36 ? i * 10 : (i - 36) * 15})`}
            fill="none"
            stroke="currentColor"
            strokeWidth=".4"
          />
        ))}
      </svg>
      <article className="receipt">
        <h2>{c.title}</h2>
        <p className="r-sub">{c.sub}</p>
        <ul className="rows">
          {c.rows.map((r) => (
            <li key={r.what}>
              <span className="what">{r.what}</span>
              <span className="who">{r.who}</span>
              <span className="amt">{r.amount}</span>
            </li>
          ))}
        </ul>
        <div className="total">
          <span>{c.total}</span>
          <strong>₩0</strong>
        </div>
      </article>
      <svg className="seal" viewBox="0 0 160 160" aria-hidden="true">
        <defs>
          <path
            id="seal-ring"
            d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"
          />
        </defs>
        <circle
          cx="80"
          cy="80"
          r="74"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="80" cy="80" r="44" fill="none" stroke="currentColor" />
        <text fontSize="11" fill="currentColor">
          <textPath href="#seal-ring" textLength="350" lengthAdjust="spacing">
            {c.seal}
          </textPath>
        </text>
        <text
          x="80"
          y="98"
          textAnchor="middle"
          fontSize="48"
          fontWeight="800"
          fill="currentColor"
        >
          0
        </text>
      </svg>
    </div>
  );
}
