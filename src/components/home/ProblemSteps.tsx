import type { Dictionary } from "@/content/types";
export function ProblemSteps({
  copy: c,
}: {
  copy: Dictionary["trust"]["steps"];
}) {
  return (
    <section id="trust-steps">
      <h2>{c.title}</h2>
      <p className="intro">{c.intro}</p>
      <ol className="steps">
        {c.items.map((s, i) => (
          <li key={s.title}>
            <span aria-hidden="true">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
