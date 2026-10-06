import { it, expect } from "vitest";
import { LANGS } from "@/lib/i18n/langs";
import { getDictionary } from "@/content";
import { site } from "@/config/site";
import {
  messengerView,
  previewBandText,
  barNote,
  quoteNotice,
  quoteDoneText,
  visibleCopy,
} from "@/lib/launch";
for (const lang of LANGS)
  it(lang + " preview/live launch projection", () => {
    const d = getDictionary(lang);
    const p = messengerView(d, "preview", site.messengerUrls);
    expect(p.href).toBeNull();
    expect(p.soonText).toBeTruthy();
    expect(previewBandText(d, "preview")).toBeTruthy();
    expect(barNote(d, "preview")).not.toBe(d.live.replyPromise);
    expect(quoteNotice(d, "preview")).toBeTruthy();
    expect(quoteDoneText(d, "preview")).toBe(d.quote.donePreview);
    expect(JSON.stringify(visibleCopy(d, "preview"))).not.toMatch(
      /24\s*(hours?|h\b|時間|jam|цаг|시간)/i,
    );
    const urls = {
      ...site.messengerUrls,
      [d.messenger.channel]: "https://example.com/channel",
    };
    expect(messengerView(d, "live", urls).href).toBe(urls[d.messenger.channel]);
    expect(messengerView(d, "live", urls).soonText).toBeNull();
    expect(previewBandText(d, "live")).toBeNull();
    expect(barNote(d, "live")).toBe(d.live.replyPromise);
    expect(quoteNotice(d, "live")).toBeNull();
    expect(quoteDoneText(d, "live")).toBe(d.live.quoteDone);
    expect(messengerView(d, "live", site.messengerUrls).href).toBeNull();
  });
