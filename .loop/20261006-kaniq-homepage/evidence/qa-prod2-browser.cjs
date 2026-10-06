const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const OUT = process.argv[2], B = "https://kaniq-homepage.vercel.app";
(async () => {
  const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
  const results = [];
  for (const lang of ["ja", "ko", "en"]) for (const w of (lang === "en" ? [1440] : [390, 768, 1440])) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [], bad = [];
    page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    page.on("response", (r) => r.status() >= 400 && bad.push(r.status() + " " + r.url()));
    await page.goto(`${B}/${lang}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate(() => {
      const h1 = document.querySelector(".hero h1") || document.querySelector("h1");
      // visual lines from per-char rects
      const chars = []; const tw = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
      let n; while ((n = tw.nextNode())) for (let i = 0; i < n.data.length; i++) {
        const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + 1);
        const rc = [...rg.getClientRects()].filter((x) => x.width > 0)[0];
        const span = n.parentElement.closest("h1 > span"); 
        chars.push({ c: n.data[i], top: rc ? Math.round(rc.top) : null, span: span ? [...h1.children].indexOf(span) : -1 });
      }
      const lines = []; let cur = null;
      for (const ch of chars) { if (ch.top === null) { if (cur) cur.t += ch.c; continue; } if (!cur || Math.abs(ch.top - cur.top) > 4) { cur = { top: ch.top, t: "", spans: new Set() }; lines.push(cur); } cur.t += ch.c; cur.spans.add(ch.span); }
      const spans = [...h1.children].map((s, i) => ({ i, text: s.innerText, ws: getComputedStyle(s).whiteSpace, wb: getComputedStyle(s).wordBreak, lines: lines.filter((l) => l.spans.has(i)).length }));
      // ko: line break must be at whitespace boundary
      const midWord = [];
      for (let k = 1; k < lines.length; k++) { const prev = lines[k - 1].t, next = lines[k].t; if (!/\s$/.test(prev) && !/^\s/.test(next) && !/[、。,.]$/.test(prev.trim())) midWord.push(prev.slice(-2) + "|" + next.slice(0, 2)); }
      return {
        h1: h1.innerText, h1FontSize: getComputedStyle(h1).fontSize, h1WordBreak: getComputedStyle(h1).wordBreak,
        lines: lines.map((l) => l.t.trim()), spans, midWordBreaks: midWord,
        scrollWidth: document.documentElement.scrollWidth, innerWidth: innerWidth,
        messengers: [...document.querySelectorAll(".cta--messenger")].map((m) => ({ tag: m.tagName, href: m.getAttribute("href"), state: m.dataset.state })),
        anchorMessengerHrefs: [...document.querySelectorAll("a[href]")].map((a) => a.href).filter((h) => /wa\.me|whatsapp|line\.me|kakao|t\.me|viber/i.test(h)),
        body24: (document.body.innerText.match(/24\s*(hours?|h\b|時間|jam|цаг|시간)|24\/7/i) || [null])[0],
        favicon: [...document.querySelectorAll("link[rel~=icon]")].map((l) => l.getAttribute("href")),
      };
    });
    r.lang = lang; r.width = w; r.pageErrors = errs; r.badResponses = bad;
    r.spansIntact = lang === "ja" ? r.spans.every((s) => s.lines === 1) : null;
    r.noOverflow = r.scrollWidth === r.innerWidth;
    if (lang !== "en") await page.locator(".hero").screenshot({ path: path.join(OUT, `qa-prod2-${lang}-${w}-hero.png`) });
    results.push(r); await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, "qa-prod2-browser.json"), JSON.stringify(results, null, 2));
  for (const r of results) console.log(r.lang, r.width, JSON.stringify(r.lines), "fs", r.h1FontSize, "spansIntact", r.spansIntact, "midWord", JSON.stringify(r.midWordBreaks), "sw/iw", r.scrollWidth, r.innerWidth, "msg", JSON.stringify(r.messengers), "aHref", r.anchorMessengerHrefs.length, "24h", r.body24, "err", r.pageErrors.length, "bad", JSON.stringify(r.badResponses));
})();
