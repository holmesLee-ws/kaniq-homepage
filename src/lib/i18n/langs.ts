export const LANGS = ["en", "ja", "id", "mn", "ko"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";
export const isLang = (v: string): v is Lang =>
  (LANGS as readonly string[]).includes(v);
export const NATIVE_NAME: Record<Lang, string> = {
  en: "English",
  ja: "日本語",
  id: "Bahasa Indonesia",
  mn: "Монгол",
  ko: "한국어",
};
export const PHASE2 = [
  { code: "hi", name: "हिन्दी" },
  { code: "ru", name: "Русский" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "zh", name: "中文" },
  { code: "es", name: "Español" },
  { code: "th", name: "ไทย" },
] as const; // c-local.html:288-293
export const OG_LOCALE: Record<Lang, string> = {
  en: "en_US",
  ja: "ja_JP",
  id: "id_ID",
  mn: "mn_MN",
  ko: "ko_KR",
};
