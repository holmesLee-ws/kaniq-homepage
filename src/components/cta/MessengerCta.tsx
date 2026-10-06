import type { messengerView } from "@/lib/launch";
export function MessengerCta({
  view,
}: {
  view: ReturnType<typeof messengerView>;
}) {
  const style = {
    background: view.colors.bg,
    color: view.colors.fg,
    borderColor: view.colors.bg,
  };
  return view.href ? (
    <a
      className="cta cta--messenger"
      style={style}
      href={view.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {view.label}
    </a>
  ) : (
    <span className="cta cta--messenger" style={style} data-state="soon">
      {view.label}
      <small>{view.soonText}</small>
    </span>
  );
}
