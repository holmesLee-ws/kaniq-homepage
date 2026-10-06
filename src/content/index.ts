import type { Lang } from "@/lib/i18n/langs";
import type { Dictionary } from "./types";
import en from "./en";
import ja from "./ja";
import id from "./id";
import mn from "./mn";
import ko from "./ko";
const DICTS: Record<Lang, Dictionary> = { en, ja, id, mn, ko };
export const getDictionary = (lang: Lang): Dictionary => DICTS[lang];
