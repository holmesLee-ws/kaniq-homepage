import { it, expect } from "vitest";
import { mergePresence, type Presence } from "@/lib/motion/presence";
const nodes = (keys: string[]): Presence<string>[] =>
  keys.map((key) => ({ key, item: key, state: "stay" }));
const merge = (prev: Presence<string>[], next: string[]) =>
  mergePresence(prev, next, (s) => s);
const snap = (p: Presence<string>[]) => p.map((n) => `${n.key}:${n.state}`);
it("preserves the first exiting item", () =>
  expect(snap(merge(nodes(["A", "B"]), ["C", "B"]))).toEqual([
    "A:exit",
    "C:enter",
    "B:stay",
  ]));
it("preserves a single replaced label", () =>
  expect(snap(merge(nodes(["D6"]), ["D9"]))).toEqual(["D6:exit", "D9:enter"]));
it("keeps exits after their preceding survivor in original order", () =>
  expect(snap(merge(nodes(["A", "B", "C", "D"]), ["A", "E", "D"]))).toEqual([
    "A:stay",
    "B:exit",
    "C:exit",
    "E:enter",
    "D:stay",
  ]));
it("reenters an exiting node without duplicate keys", () => {
  const first = merge(nodes(["A", "B"]), ["C", "B"]),
    second = merge(first, ["A", "B"]);
  expect(snap(second)).toEqual(["A:enter", "C:exit", "B:stay"]);
  expect(new Set(second.map((n) => n.key)).size).toBe(second.length);
});
it("keeps next ordering when survivors move", () =>
  expect(snap(merge(nodes(["A", "B"]), ["B", "A"]))).toEqual([
    "B:stay",
    "A:stay",
  ]));
