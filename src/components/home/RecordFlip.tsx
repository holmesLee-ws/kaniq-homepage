"use client";
import { useId, useSyncExternalStore, useState } from "react";
const subscribe = () => () => {};
export function RecordFlip({
  header,
  front,
  back,
  label,
}: {
  header: React.ReactNode;
  front: React.ReactNode;
  back: React.ReactNode;
  label: string;
}) {
  const [on, setOn] = useState(false);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const id = useId();
  return (
    <article
      className="record"
      data-flipped={on}
      data-mounted={mounted || undefined}
    >
      <header>{header}</header>
      <div className="record-faces" id={id}>
        <div
          className="face face-front"
          inert={mounted && on}
          aria-hidden={(mounted && on) || undefined}
        >
          {front}
        </div>
        <div
          className="face face-back"
          inert={mounted && !on}
          aria-hidden={(mounted && !on) || undefined}
        >
          {back}
        </div>
      </div>
      <button
        type="button"
        className="flip-btn"
        aria-pressed={on}
        aria-controls={id}
        onClick={() => setOn(!on)}
      >
        {label}
      </button>
    </article>
  );
}
