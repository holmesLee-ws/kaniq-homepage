import { useEffect, useState } from "react";
export type Presence<T> = {
  key: string;
  item: T;
  state: "enter" | "stay" | "exit";
};
export function mergePresence<T>(
  prev: readonly Presence<T>[],
  next: readonly T[],
  keyOf: (t: T) => string,
): Presence<T>[] {
  const old = new Map(prev.map((p) => [p.key, p]));
  const keys = new Set(next.map(keyOf));
  const exits = new Map<string | null, Presence<T>[]>();
  let anchor: string | null = null;
  for (const p of prev) {
    if (keys.has(p.key)) anchor = p.key;
    else {
      const list = exits.get(anchor) ?? [];
      list.push({ ...p, state: "exit" });
      exits.set(anchor, list);
    }
  }
  const result: Presence<T>[] = [...(exits.get(null) ?? [])];
  for (const item of next) {
    const key = keyOf(item),
      previous = old.get(key);
    result.push(
      {
        key,
        item,
        state: previous && previous.state !== "exit" ? "stay" : "enter",
      },
      ...(exits.get(key) ?? []),
    );
  }
  return result;
}
export function usePresence<T>(
  next: readonly T[],
  keyOf: (t: T) => string,
  exitMs = 200,
): Presence<T>[] {
  const [state, setState] = useState(() => ({
    next,
    nodes: next.map((item) => ({
      key: keyOf(item),
      item,
      state: "stay" as const,
    })) as Presence<T>[],
  }));
  if (state.next !== next) {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setState({
      next,
      nodes: reduce
        ? next.map((item) => ({ key: keyOf(item), item, state: "stay" }))
        : mergePresence(state.nodes, next, keyOf),
    });
  }
  useEffect(() => {
    if (!state.nodes.some((p) => p.state === "exit")) return;
    const timer = setTimeout(
      () =>
        setState((s) => ({
          ...s,
          nodes: s.nodes.filter((p) => p.state !== "exit"),
        })),
      exitMs,
    );
    return () => clearTimeout(timer);
  }, [state.nodes, exitMs]);
  return state.nodes;
}
