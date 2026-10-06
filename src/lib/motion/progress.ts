const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
export const viewProgress = (top: number, height: number, vh: number) =>
  clamp01((vh - top) / (vh + height));
export const docProgress = (y: number, max: number) =>
  max <= 0 ? 1 : clamp01(y / max);
export const reachedSteps = (p: number) =>
  Math.min(4, Math.floor(clamp01(p) * 4 + 0.5));
