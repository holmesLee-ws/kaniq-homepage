// QA r3 G4 production browser run — 20261006-kaniq-homepage, prod source edd3834 (tree == e1730b9)
// run: cd /tmp/leh-qa-tools && node <this> <evidence_dir>   (playwright@1.63.0, system Chrome headless)
const { chromium } = require("playwright");
const fs = require("fs");
const B = process.env.QA_BASE || "https://kaniq-homepage.vercel.app";
const E = process.argv[2];
const SPEC_H1 = { en: "Care your insurance won’t cover, planned in Korea.", ja: "ソウルまで2時間。精密検診も歯科も、週末で。" };
const SPEC_MSG = { en: "WhatsApp", ja: "LINE" };
const out = { base: B, startedAt: new Date().toISOString(), pages: {}, pageErrors: [], consoleErrors: [], failedRequests: [] };
const shot = (p, n) => p.screenshot({ path: `${E}/qa-prod-${n}.png` });
const plan = (p) => p.evaluate(() => ({
  url: location.href,
  title: document.querySelector("#plan-title")?.innerText.trim(),
  sub: document.querySelector("#plan-sub")?.innerText.trim(),
  price: document.querySelector("#price")?.innerText.trim(),
  labels: [...document.querySelectorAll("#plan-card ol.days > li .day-label")].map((x) => x.innerText.trim()),
  badges: document.querySelectorAll("#plan-card .okbadge").length,
  checked: [...document.querySelectorAll("#planner input:checked")].map((i) => i.id),
}));
async function tabTo(p, id, max = 60) { for (let i = 1; i <= max; i++) { await p.keyboard.press("Tab"); if ((await p.evaluate(() => document.activeElement?.id)) === id) return i; } throw new Error("tabTo " + id); }

async function run(ctx, lang) {
  const r = { lang };
  const p = await ctx.newPage();
  p.on("pageerror", (e) => out.pageErrors.push(`${lang}: ${e.message}`));
  p.on("console", (m) => { if (m.type() === "error") out.consoleErrors.push(`${lang}: ${m.text()}`); });
  p.on("response", (res) => { if (res.status() >= 400) out.failedRequests.push(`${lang}: ${res.status()} ${res.url()}`); });
  await p.setViewportSize({ width: 1440, height: 900 });
  const resp = await p.goto(`${B}/${lang}`, { waitUntil: "networkidle" });
  r.status = resp.status();
  Object.assign(r, await p.evaluate(() => ({
    htmlLang: document.documentElement.lang, dpl: document.documentElement.dataset.dplId,
    h1: document.querySelector("h1").innerText,
    band: document.querySelector(".draft-note")?.innerText || null,
    messengers: [...document.querySelectorAll(".cta--messenger")].map((m) => ({ tag: m.tagName, href: m.getAttribute("href"), text: m.innerText.replace(/\s+/g, " "), state: m.dataset.state })),
    body24: (document.body.innerText.match(/24\s*(hours?|h\b|時間|jam|цаг|시간)/i) || [null])[0],
    fontsLoaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
    imgsBroken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
    scrollW1440: document.documentElement.scrollWidth, innerW: innerWidth,
  })));
  r.h1Collapsed = lang === "ja" ? r.h1.replace(/\s/g, "") : r.h1.replace(/\s+/g, " ").trim();
  r.h1Match = r.h1Collapsed === SPEC_H1[lang];
  r.messengerMatch = r.messengers.length > 0 && r.messengers.every((m) => m.text.startsWith(SPEC_MSG[lang]) && m.href === null);
  await shot(p, `${lang}-1440-hero`);
  // planner: one keyboard manipulation — treatment +2 (ArrowRight×2), days → next (Tab, ArrowRight)
  const s0 = await plan(p);
  await p.mouse.click(5, 5);
  const first = s0.checked.find((id) => id.startsWith("tx-"));
  r.tabsToTx = await tabTo(p, first);
  await p.keyboard.press("ArrowRight"); await p.keyboard.press("ArrowRight"); await p.waitForTimeout(300);
  const s1 = await plan(p);
  await p.keyboard.press("Tab"); await p.keyboard.press("ArrowRight"); await p.waitForTimeout(300);
  const s2 = await plan(p);
  r.planner = { s0, s1, s2,
    assert: {
      tx_changes_title_price: s0.title !== s1.title && s0.price !== s1.price,
      days_changes_labels_not_price: JSON.stringify(s1.labels) !== JSON.stringify(s2.labels) && s1.price === s2.price,
      url_unchanged: s0.url === s1.url && s1.url === s2.url,
      badges_present: s1.badges > 0 && s2.badges > 0,
    } };
  await p.locator("#plan-card").scrollIntoViewIfNeeded();
  await shot(p, `${lang}-1440-planner-after`);
  // mobile bottom bar 390x844
  await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
  await shot(p, `${lang}-390-hero-bar`);
  r.bar390 = await p.evaluate(() => { const b = document.querySelector(".msgbar"); const rc = b.getBoundingClientRect(); return { pos: getComputedStyle(b).position, bottom: Math.round(rc.bottom), innerHeight, scrollW: document.documentElement.scrollWidth, innerW: innerWidth, text: b.innerText.replace(/\s+/g, " ") }; });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2)); await p.waitForTimeout(400);
  r.bar390mid = await p.evaluate(() => { const rc = document.querySelector(".msgbar").getBoundingClientRect(); return { bottom: Math.round(rc.bottom), innerHeight }; });
  await shot(p, `${lang}-390-mid-bar`);
  await p.close();
  return r;
}
(async () => {
  const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
  const ctx = await browser.newContext({ locale: "en-US" });
  for (const l of ["en", "ja"]) out.pages[l] = await run(ctx, l);
  await browser.close();
  out.finishedAt = new Date().toISOString();
  fs.writeFileSync(`${E}/qa-prod-browser.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})().catch((e) => { console.error("FAIL", e.constructor.name, e.message); process.exit(1); });
