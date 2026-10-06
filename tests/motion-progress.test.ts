import { it, expect } from "vitest";
import { viewProgress, docProgress, reachedSteps } from "@/lib/motion/progress";
it("view progress follows entry, center and exit in both directions", () => {
  expect(
    [900, 250, -400, 250].map((top) => viewProgress(top, 400, 900)),
  ).toEqual([0, 0.5, 1, 0.5]);
  expect(viewProgress(1200, 400, 900)).toBe(0);
});
it("document progress clamps and handles a short page", () => {
  expect([-1, 0, 500, 1000, 2000].map((y) => docProgress(y, 1000))).toEqual([
    0, 0, 0.5, 1, 1,
  ]);
  expect(docProgress(0, 0)).toBe(1);
  expect(docProgress(0, -1)).toBe(1);
});
it("reached steps track rounded quarter thresholds", () =>
  expect([0, 0.125, 0.375, 0.625, 0.875, 1].map(reachedSteps)).toEqual([
    0, 1, 2, 3, 4, 4,
  ]));
