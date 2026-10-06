import { describe, it, expect } from "vitest";
import { negotiateLanguage } from "@/lib/i18n/negotiate";
describe("language negotiation", () => {
  it.each([
    ["en", "en"],
    ["ja", "ja"],
    ["id", "id"],
    ["mn", "mn"],
    ["ko", "ko"],
    ["ko-KR", "ko"],
    ["ko;q=0.1, en;q=0.9", "en"],
    ["fr", "en"],
    [null, "en"],
    ["", "en"],
    ["*", "en"],
    ["KO", "ko"],
    ["mn-MN", "mn"],
    ["zh-CN,ko;q=0.5", "ko"],
    ["ko;q=0, ja;q=0.1", "ja"],
    ["ja;q=abc, id", "id"],
    ["en;q=0.5, ja;q=0.5", "en"],
    ["ko;q=2,id", "id"],
    ["ja ;q=0.9", "ja"],
    ["ko ; q=0.5, en;q=0.4", "ko"],
  ])("%s → %s", (header, lang) => expect(negotiateLanguage(header)).toBe(lang));
});
