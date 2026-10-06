import { isLang, type Lang } from "./langs";
export function negotiateLanguage(header: string | null): Lang {
  const entries = (header ?? "")
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const quality = params.find((p) => p.trim().startsWith("q="));
      const q = quality === undefined ? 1 : Number(quality.trim().slice(2));
      return { tag: tag.trim(), q, index };
    })
    .filter(
      ({ tag, q }) => tag !== "*" && Number.isFinite(q) && q > 0 && q <= 1,
    )
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const { tag } of entries) {
    const lang = tag.split("-")[0];
    if (isLang(lang)) return lang;
  }
  return "en";
}
