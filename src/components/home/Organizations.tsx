import type { Dictionary } from "@/content/types";
export function Organizations({
  copy: c,
}: {
  copy: Dictionary["organizations"];
}) {
  return (
    <section id="organizations" className="section wrap">
      <h2>{c.title}</h2>
      <p className="intro">{c.intro}</p>
      <ul className="org-list">
        {c.items.map((o) => (
          <li key={o.who}>
            <strong>{o.who}</strong>
            <span>{o.what}</span>
          </li>
        ))}
      </ul>
      <p>{c.note}</p>
    </section>
  );
}
